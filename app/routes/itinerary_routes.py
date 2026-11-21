import json
from flask import Blueprint, request, jsonify
from ..models import db, Itinerary, BookingInquiry, User, SystemSetting
from ..services.auth_service import token_required, optional_token

itinerary_bp = Blueprint('itineraries', __name__, url_prefix='/api/itineraries')

@itinerary_bp.route('', methods=['GET'])
@token_required
def list_itineraries(current_user):
    # Customers see only their itineraries; employees and admins can see all or filter by user
    if current_user.is_employee():
        user_filter = request.args.get('user_id')
        if user_filter:
            itineraries = Itinerary.query.filter_by(user_id=int(user_filter)).order_by(Itinerary.created_at.desc()).all()
        else:
            itineraries = Itinerary.query.order_by(Itinerary.created_at.desc()).all()
    else:
        itineraries = Itinerary.query.filter_by(user_id=current_user.id).order_by(Itinerary.created_at.desc()).all()

    return jsonify({
        'success': True,
        'count': len(itineraries),
        'itineraries': [it.to_dict() for it in itineraries]
    })

@itinerary_bp.route('', methods=['POST'])
@optional_token
def create_itinerary(current_user):
    data = request.get_json() or {}
    
    title = data.get('title', 'My Custom Journey')
    dest_name = data.get('destination_name', 'Global Destination')
    dest_id = data.get('destination_id')
    origin = data.get('origin_city', 'New York')
    start_date = data.get('start_date')
    duration = int(data.get('duration_days', 5))
    travelers = int(data.get('travelers_count', 1))
    budget = float(data.get('total_budget', 2000.0))
    cost = float(data.get('estimated_cost', budget))
    travel_style = data.get('travel_style', 'Cultural & Sightseeing')
    accommodation_tier = data.get('accommodation_tier', 'Comfort (3-4 Star)')
    
    cost_breakdown = data.get('cost_breakdown', {})
    daily_schedule = data.get('daily_schedule', [])
    selected_flight = data.get('selected_flight', None)
    selected_hotel = data.get('selected_hotel', None)
    notes = data.get('user_notes', '')

    user_id = current_user.id if current_user else None

    itinerary = Itinerary(
        user_id=user_id,
        title=title,
        destination_id=dest_id,
        destination_name=dest_name,
        origin_city=origin,
        start_date=start_date,
        duration_days=duration,
        travelers_count=travelers,
        total_budget=budget,
        estimated_cost=cost,
        travel_style=travel_style,
        accommodation_tier=accommodation_tier,
        cost_breakdown=json.dumps(cost_breakdown),
        daily_schedule=json.dumps(daily_schedule),
        selected_flight=json.dumps(selected_flight) if selected_flight else None,
        selected_hotel=json.dumps(selected_hotel) if selected_hotel else None,
        user_notes=notes,
        status='Saved'
    )

    db.session.add(itinerary)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Itinerary saved successfully!',
        'itinerary': itinerary.to_dict()
    }), 201

@itinerary_bp.route('/<int:itinerary_id>', methods=['GET'])
def get_itinerary(itinerary_id):
    itinerary = Itinerary.query.get_or_404(itinerary_id)
    return jsonify({
        'success': True,
        'itinerary': itinerary.to_dict()
    })

@itinerary_bp.route('/<int:itinerary_id>', methods=['PUT'])
@token_required
def update_itinerary(current_user, itinerary_id):
    itinerary = Itinerary.query.get_or_404(itinerary_id)

    # Permission check: owner or employee/admin
    if not current_user.is_employee() and itinerary.user_id != current_user.id:
        return jsonify({'success': False, 'message': 'Permission denied.'}), 403

    data = request.get_json() or {}
    
    if 'title' in data:
        itinerary.title = data['title']
    if 'daily_schedule' in data:
        itinerary.set_daily_schedule(data['daily_schedule'])
        itinerary.is_customized = True
    if 'cost_breakdown' in data:
        itinerary.set_cost_breakdown(data['cost_breakdown'])
    if 'total_budget' in data:
        itinerary.total_budget = float(data['total_budget'])
    if 'estimated_cost' in data:
        itinerary.estimated_cost = float(data['estimated_cost'])
    if 'user_notes' in data:
        itinerary.user_notes = data['user_notes']
    if 'status' in data:
        itinerary.status = data['status']
    if 'selected_hotel' in data:
        itinerary.set_selected_hotel(data['selected_hotel'])
    if 'selected_flight' in data:
        itinerary.set_selected_flight(data['selected_flight'])

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Itinerary updated successfully.',
        'itinerary': itinerary.to_dict()
    })

@itinerary_bp.route('/<int:itinerary_id>', methods=['DELETE'])
@token_required
def delete_itinerary(current_user, itinerary_id):
    itinerary = Itinerary.query.get_or_404(itinerary_id)

    if not current_user.is_employee() and itinerary.user_id != current_user.id:
        return jsonify({'success': False, 'message': 'Permission denied.'}), 403

    db.session.delete(itinerary)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Itinerary deleted successfully.'
    })

@itinerary_bp.route('/<int:itinerary_id>/inquire', methods=['POST'])
@optional_token
def submit_inquiry(current_user, itinerary_id):
    itinerary = Itinerary.query.get_or_404(itinerary_id)
    data = request.get_json() or {}

    customer_name = data.get('customer_name') or (current_user.full_name if current_user else 'Valued Traveler')
    customer_email = data.get('customer_email') or (current_user.email if current_user else 'traveler@example.com')
    customer_phone = data.get('customer_phone') or (current_user.phone if current_user else '')
    special_requests = data.get('special_requests', '')

    # Calculate estimated commission and discount
    default_comm_rate = float(SystemSetting.get_value('default_commission_percent', '10.0'))
    quote = itinerary.estimated_cost
    commission = round(quote * (default_comm_rate / 100.0), 2)

    inquiry = BookingInquiry(
        itinerary_id=itinerary.id,
        user_id=current_user.id if current_user else itinerary.user_id,
        customer_name=customer_name,
        customer_email=customer_email,
        customer_phone=customer_phone,
        status='Pending',
        quote_amount=quote,
        discount_applied=round(quote * 0.05, 2), # 5% agency bundle discount
        commission_earned=commission,
        customer_special_requests=special_requests
    )

    itinerary.status = 'Inquired'

    db.session.add(inquiry)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Booking inquiry submitted successfully! A JBD Travel Specialist will review your customized itinerary and finalize your reservation.',
        'inquiry': inquiry.to_dict()
    }), 201
