import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from ..models import Destination, TouristAttraction

# Standard feature vocabulary for AI preference matching
FEATURE_KEYS = [
    'adventure',
    'relaxation',
    'culture',
    'nature',
    'sightseeing',
    'foodie',
    'luxury',
    'nightlife',
    'heritage',
    'beaches',
    'shopping',
    'romantic'
]

def vectorize_tags(tags_list):
    """Converts tags list into a binary/frequency feature vector"""
    tags_lower = [t.lower().strip() for t in tags_list]
    vector = [1.0 if key in tags_lower or any(key in t for t in tags_lower) else 0.0 for key in FEATURE_KEYS]
    return vector

class AIRecommender:
    """
    AI-Assisted Hybrid Recommendation Engine for JBD Travels
    Combines Content-Based Preference Matching (Cosine Similarity)
    with Budget Feasibility Scoring and Seasonal Rating.
    """

    @classmethod
    def recommend_destinations(cls, user_preferences, user_budget=None, duration_days=5, travelers_count=1, limit=6):
        destinations = Destination.query.all()
        if not destinations:
            return []

        # Vectorize user preferences
        if isinstance(user_preferences, str):
            user_pref_list = [p.strip().lower() for p in user_preferences.split(',')]
        elif isinstance(user_preferences, list):
            user_pref_list = [str(p).strip().lower() for p in user_preferences]
        else:
            user_pref_list = []

        user_vec = vectorize_tags(user_pref_list)

        # If user vector is all zeros, set equal uniform weight
        if sum(user_vec) == 0:
            user_vec = [1.0] * len(FEATURE_KEYS)

        user_matrix = np.array([user_vec])

        # Destination vectors
        dest_vectors = []
        for dest in destinations:
            d_tags = dest.get_tags_list()
            dest_vectors.append(vectorize_tags(d_tags))

        dest_matrix = np.array(dest_vectors)

        # Compute cosine similarity between user preferences and all destinations
        sim_scores = cosine_similarity(user_matrix, dest_matrix)[0]

        # Calculate daily budget per traveler if budget provided
        daily_budget_per_person = None
        if user_budget and duration_days > 0 and travelers_count > 0:
            daily_budget_per_person = float(user_budget) / (duration_days * travelers_count)

        recommendations = []
        for i, dest in enumerate(destinations):
            base_similarity = float(sim_scores[i])
            
            # Budget feasibility factor
            budget_fit_score = 1.0
            budget_reason = "Well within budget"
            
            if daily_budget_per_person is not None:
                avg_mid = dest.avg_cost_per_day_mid
                avg_budget = dest.avg_cost_per_day_budget
                avg_luxury = dest.avg_cost_per_day_luxury
                
                if daily_budget_per_person >= avg_mid:
                    budget_fit_score = 1.0
                    budget_reason = f"Excellent match for your ${daily_budget_per_person:.0f}/day budget (Avg cost ${avg_mid:.0f}/day)"
                elif daily_budget_per_person >= avg_budget:
                    # Slightly tight but feasible with budget accommodation
                    budget_fit_score = 0.85
                    budget_reason = f"Feasible with budget accommodations (Avg ${avg_budget:.0f}/day)"
                else:
                    # Budget is lower than destination budget average
                    ratio = max(0.4, daily_budget_per_person / avg_budget)
                    budget_fit_score = ratio
                    budget_reason = f"Slightly tight budget for {dest.name} (Estimated min ${avg_budget:.0f}/day)"

            # Safety & Featured bonuses
            safety_factor = min(1.0, dest.safety_rating / 5.0)
            
            # Weighted hybrid score (Preference match 60%, Budget fit 30%, Quality/Safety 10%)
            final_score = (base_similarity * 0.60) + (budget_fit_score * 0.30) + (safety_factor * 0.10)
            match_percentage = min(99, max(45, int(final_score * 100)))

            # Matched highlights
            matched_tags = [tag for tag in dest.get_tags_list() if tag.lower() in user_pref_list or any(p in tag.lower() for p in user_pref_list)]
            
            # Generate AI explanation
            why_recommended = cls._generate_recommendation_reason(dest, user_pref_list, budget_reason, match_percentage)

            recommendations.append({
                'destination': dest.to_dict(include_attractions=False),
                'match_percentage': match_percentage,
                'matched_tags': matched_tags,
                'budget_reason': budget_reason,
                'why_recommended': why_recommended,
                'top_attractions': [a.to_dict() for a in dest.attractions.limit(3).all()]
            })

        # Sort descending by match percentage
        recommendations.sort(key=lambda x: x['match_percentage'], reverse=True)
        return recommendations[:limit]

    @staticmethod
    def _generate_recommendation_reason(dest, preferences, budget_reason, match_score):
        city = dest.city
        country = dest.country
        tags = dest.get_tags_list()
        
        pref_str = ", ".join(preferences[:3]) if preferences else "travel exploration"
        highlights_str = ", ".join(tags[:3]) if tags else "scenic beauty"

        reasons = [
            f"Based on your interest in {pref_str}, {city} offers world-class {highlights_str}.",
            f"{budget_reason}. Best visited during {dest.best_time_to_visit}.",
            f"Rated {dest.safety_rating}/5.0 for traveler safety with reliable transit and rich local experiences."
        ]
        return " ".join(reasons)
