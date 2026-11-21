from flask import Blueprint, request, jsonify
from ..models import db, Destination, TouristAttraction

destination_bp = Blueprint('destinations', __name__, url_prefix='/api/destinations')

@destination_bp.route('', methods=['GET'])
def list_destinations():
    query = Destination.query
    
    search = request.args.get('search', '').strip()
    continent = request.args.get('continent', '').strip()
    tag = request.args.get('tag', '').strip()
    featured = request.args.get('featured', '').strip()
    max_budget_per_day = request.args.get('max_budget_per_day', None)

    if search:
        query = query.filter(
            (Destination.name.ilike(f"%{search}%")) |
            (Destination.city.ilike(f"%{search}%")) |
            (Destination.country.ilike(f"%{search}%"))
        )

    if continent and continent != 'All':
        query = query.filter(Destination.continent == continent)

    if tag:
        query = query.filter(Destination.tags.ilike(f"%{tag}%"))

    if featured and featured.lower() in ['true', '1']:
        query = query.filter(Destination.is_featured == True)

    if max_budget_per_day:
        try:
            val = float(max_budget_per_day)
            query = query.filter(Destination.avg_cost_per_day_budget <= val)
        except Exception:
            pass

    destinations = query.all()
    return jsonify({
        'success': True,
        'count': len(destinations),
        'destinations': [d.to_dict(include_attractions=False) for d in destinations]
    })

@destination_bp.route('/<int:dest_id>', methods=['GET'])
def get_destination(dest_id):
    destination = Destination.query.get_or_404(dest_id)
    return jsonify({
        'success': True,
        'destination': destination.to_dict(include_attractions=True)
    })

@destination_bp.route('/<int:dest_id>/attractions', methods=['GET'])
def get_destination_attractions(dest_id):
    destination = Destination.query.get_or_404(dest_id)
    attractions = destination.attractions.all()
    return jsonify({
        'success': True,
        'destination_name': destination.name,
        'attractions': [a.to_dict() for a in attractions]
    })
