from flask import Blueprint, request, jsonify
from ..services.hotel_service import HotelService

hotel_bp = Blueprint('hotels', __name__, url_prefix='/api/hotels')

@hotel_bp.route('', methods=['GET'])
def list_hotels():
    destination = request.args.get('destination', '').strip()
    min_stars = request.args.get('stars', None)
    max_price = request.args.get('max_price', None)
    amenities = request.args.get('amenities', None)
    partner_only = request.args.get('partner_only', 'false').lower() in ['true', '1']
    sort_by = request.args.get('sort_by', 'recommended').strip()

    hotels = HotelService.search_hotels(
        destination_query=destination,
        min_stars=min_stars,
        max_price=max_price,
        amenities_filter=amenities,
        partner_only=partner_only,
        sort_by=sort_by
    )

    return jsonify({
        'success': True,
        'count': len(hotels),
        'hotels': hotels
    })

@hotel_bp.route('/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    hotel_data = HotelService.get_hotel_details(hotel_id)
    if not hotel_data:
        return jsonify({'success': False, 'message': 'Hotel not found'}), 404

    return jsonify({
        'success': True,
        'hotel': hotel_data
    })
