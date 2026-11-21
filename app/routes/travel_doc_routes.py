from flask import Blueprint, request, jsonify
from ..services.travel_doc_service import TravelDocService
from ..models import TravelDocRequirement, Destination

travel_doc_bp = Blueprint('travel_docs', __name__, url_prefix='/api/travel-docs')

@travel_doc_bp.route('/check', methods=['GET'])
def check_requirements():
    origin = request.args.get('origin', 'United States').strip()
    destination = request.args.get('destination', 'Japan').strip()

    advisory = TravelDocService.get_requirement(origin, destination)

    return jsonify({
        'success': True,
        'advisory': advisory
    })

@travel_doc_bp.route('/countries', methods=['GET'])
def get_supported_countries():
    # Gather distinct countries from destinations and requirement catalog
    dest_countries = [d.country for d in Destination.query.with_entities(Destination.country).distinct().all()]
    popular_origins = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
        'France', 'India', 'Japan', 'Singapore', 'United Arab Emirates', 'South Africa'
    ]
    all_countries = sorted(list(set(dest_countries + popular_origins)))
    return jsonify({
        'success': True,
        'origins': popular_origins,
        'destinations': dest_countries,
        'all_countries': all_countries
    })
