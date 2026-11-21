from flask import Blueprint, request, jsonify
from ..services.ai_recommender import AIRecommender
from ..services.itinerary_generator import ItineraryGenerator

recommendation_bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')

@recommendation_bp.route('/destinations', methods=['POST'])
def recommend_destinations():
    data = request.get_json() or {}
    preferences = data.get('preferences', [])
    budget = data.get('budget', None)
    duration_days = int(data.get('duration_days', 5))
    travelers_count = int(data.get('travelers_count', 1))
    limit = int(data.get('limit', 6))

    results = AIRecommender.recommend_destinations(
        user_preferences=preferences,
        user_budget=budget,
        duration_days=duration_days,
        travelers_count=travelers_count,
        limit=limit
    )

    return jsonify({
        'success': True,
        'ai_engine': 'JBD TravelGenie Hybrid Recommendation Model (Scikit-Learn Cosine Similarity + Budget Feasibility)',
        'count': len(results),
        'recommendations': results
    })

@recommendation_bp.route('/itinerary', methods=['POST'])
def generate_itinerary():
    data = request.get_json() or {}
    destination_id_or_name = data.get('destination')
    budget = data.get('budget', 2000.0)
    duration_days = int(data.get('duration_days', 5))
    travelers_count = int(data.get('travelers_count', 1))
    travel_style = data.get('travel_style', 'Cultural & Sightseeing')
    accommodation_tier = data.get('accommodation_tier', 'Comfort (3-4 Star)')
    origin_city = data.get('origin_city', 'New York')
    start_date = data.get('start_date', None)

    if not destination_id_or_name:
        return jsonify({'success': False, 'message': 'Destination is required.'}), 400

    plan = ItineraryGenerator.generate_plan(
        destination_id_or_name=destination_id_or_name,
        budget=budget,
        duration_days=duration_days,
        travelers_count=travelers_count,
        travel_style=travel_style,
        accommodation_tier=accommodation_tier,
        origin_city=origin_city,
        start_date=start_date
    )

    return jsonify({
        'success': True,
        'ai_model': 'JBD Dynamic Itinerary & Expense Optimization Engine',
        'plan': plan
    })
