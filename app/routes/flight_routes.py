from flask import Blueprint, request, jsonify
from ..services.flight_service import FlightService

flight_bp = Blueprint('flights', __name__, url_prefix='/api/flights')

@flight_bp.route('/search', methods=['GET'])
def search_flights():
    origin = request.args.get('origin', 'New York').strip()
    destination = request.args.get('destination', '').strip()
    cabin_class = request.args.get('cabin_class', 'Economy').strip()
    stops = request.args.get('stops', None)
    max_price = request.args.get('max_price', None)
    sort_by = request.args.get('sort_by', 'price').strip()

    data = FlightService.search_flights(
        origin_city=origin,
        destination_city=destination,
        cabin_class=cabin_class,
        stops_filter=stops,
        max_price=max_price,
        sort_by=sort_by
    )

    return jsonify({
        'success': True,
        **data
    })
