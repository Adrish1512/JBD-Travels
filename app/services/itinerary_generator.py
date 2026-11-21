import json
from datetime import datetime, timedelta
from ..models import Destination, TouristAttraction, Hotel, FlightOffer

class ItineraryGenerator:
    """
    Intelligent Budget-Based Itinerary & Expense Planner for JBD Travels.
    Creates structured, day-by-day schedules tailored to traveler preferences,
    budget constraints, and accommodation preferences.
    """

    @classmethod
    def generate_plan(cls, destination_id_or_name, budget, duration_days=5, travelers_count=1,
                      travel_style='Cultural & Sightseeing', accommodation_tier='Comfort (3-4 Star)',
                      origin_city='New York', start_date=None):
        
        # Resolve destination
        destination = None
        if isinstance(destination_id_or_name, int) or (isinstance(destination_id_or_name, str) and destination_id_or_name.isdigit()):
            destination = Destination.query.get(int(destination_id_or_name))
        else:
            destination = Destination.query.filter(
                (Destination.name.ilike(f"%{destination_id_or_name}%")) | 
                (Destination.city.ilike(f"%{destination_id_or_name}%"))
            ).first()

        if not destination:
            # Fallback to first featured destination
            destination = Destination.query.filter_by(is_featured=True).first() or Destination.query.first()

        budget = float(budget)
        duration_days = max(1, min(30, int(duration_days)))
        travelers_count = max(1, min(20, int(travelers_count)))

        # 1. Budget Breakdown Allocation Strategy
        # Standard recommended proportions
        transport_pct = 0.35
        hotel_pct = 0.32
        activities_pct = 0.16
        dining_pct = 0.12
        buffer_pct = 0.05

        allocated_transport = round(budget * transport_pct, 2)
        allocated_hotel = round(budget * hotel_pct, 2)
        allocated_activities = round(budget * activities_pct, 2)
        allocated_dining = round(budget * dining_pct, 2)
        allocated_buffer = round(budget * buffer_pct, 2)

        # 2. Select Matching Partner Hotel
        hotels = Hotel.query.filter_by(destination_id=destination.id, is_active=True).all()
        selected_hotel = None
        
        if hotels:
            # Pick hotel closest to allocated budget per night
            target_per_night = allocated_hotel / duration_days
            # Sort by absolute difference to target per night
            hotels_sorted = sorted(hotels, key=lambda h: abs(h.jbd_partner_rate - target_per_night))
            selected_hotel = hotels_sorted[0].to_dict()
            actual_hotel_cost = round(selected_hotel['jbd_partner_rate'] * duration_days, 2)
        else:
            # Estimated hotel cost based on destination averages
            if 'Luxury' in accommodation_tier or '5 Star' in accommodation_tier:
                night_rate = destination.avg_cost_per_day_luxury * 0.6
            elif 'Budget' in accommodation_tier or 'Hostel' in accommodation_tier:
                night_rate = destination.avg_cost_per_day_budget * 0.5
            else:
                night_rate = destination.avg_cost_per_day_mid * 0.55
                
            actual_hotel_cost = round(night_rate * duration_days, 2)
            selected_hotel = {
                'name': f"JBD Partner Grand {destination.city} Hotel",
                'city': destination.city,
                'stars': 4,
                'jbd_partner_rate': round(night_rate, 2),
                'standard_rate_per_night': round(night_rate * 1.2, 2),
                'partner_discount_percent': 15.0,
                'is_partner': True,
                'amenities': ['Free Wi-Fi', 'Breakfast Included', 'Concierge Service']
            }

        # 3. Select Matching Flight
        flights = FlightOffer.query.filter_by(
            origin_city=origin_city,
            destination_city=destination.city
        ).all()

        selected_flight = None
        if flights:
            # Pick flight fitting best within transport budget
            flights_sorted = sorted(flights, key=lambda f: f.total_price_usd)
            selected_flight = flights_sorted[0].to_dict()
            actual_flight_cost = round(selected_flight['total_price_usd'] * travelers_count, 2)
        else:
            # Generate realistic flight estimation
            est_base = round(min(allocated_transport / max(1, travelers_count), 650.0), 2)
            selected_flight = {
                'airline_name': 'JBD Partner Airways',
                'flight_number': f"JB-{destination.airport_code}-101",
                'origin_city': origin_city,
                'origin_code': 'JFK' if origin_city == 'New York' else 'ORG',
                'destination_city': destination.city,
                'destination_code': destination.airport_code,
                'cabin_class': 'Economy',
                'departure_time': '09:15 AM',
                'arrival_time': '03:45 PM',
                'duration_formatted': '7h 30m',
                'stops': 0,
                'total_price_usd': est_base,
                'baggage_allowance': '1 x 23kg checked bag',
                'is_simulated': True,
                'data_source_label': 'JBD Global GDS Simulation'
            }
            actual_flight_cost = round(est_base * travelers_count, 2)

        # 4. Generate Day-by-Day Schedule with Attractions
        attractions = destination.attractions.all()
        daily_schedule = []
        actual_activities_cost = 0.0

        if not start_date:
            start_date_obj = datetime.now() + timedelta(days=14)
            start_date_str = start_date_obj.strftime("%Y-%m-%d")
        else:
            start_date_str = start_date
            try:
                start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
            except Exception:
                start_date_obj = datetime.now() + timedelta(days=14)

        # Assign attractions to days
        attraction_idx = 0
        num_attractions = len(attractions)

        for day_num in range(1, duration_days + 1):
            curr_date = (start_date_obj + timedelta(days=day_num - 1)).strftime("%b %d, %Y")
            
            # Morning activity
            if num_attractions > 0:
                attr_morning = attractions[attraction_idx % num_attractions]
                attraction_idx += 1
                morning_title = f"Visit {attr_morning.name}"
                morning_desc = attr_morning.description
                morning_cost = attr_morning.ticket_price_usd * travelers_count
                morning_category = attr_morning.category
                morning_tips = attr_morning.tips
            else:
                morning_title = f"Explore {destination.city} Historic Center"
                morning_desc = f"Walking tour of iconic landmarks and architectural wonders in {destination.city}."
                morning_cost = 15.0 * travelers_count
                morning_category = "Sightseeing"
                morning_tips = "Wear comfortable walking shoes."

            # Afternoon activity
            if num_attractions > 1:
                attr_afternoon = attractions[attraction_idx % num_attractions]
                attraction_idx += 1
                afternoon_title = f"Discover {attr_afternoon.name}"
                afternoon_desc = attr_afternoon.description
                afternoon_cost = attr_afternoon.ticket_price_usd * travelers_count
                afternoon_category = attr_afternoon.category
                afternoon_tips = attr_afternoon.tips
            else:
                afternoon_title = f"{travel_style} Experience & Cultural Workshop"
                afternoon_desc = f"Immerse yourself in authentic local traditions, museums, and artisan shops."
                afternoon_cost = 25.0 * travelers_count
                afternoon_category = "Cultural"
                afternoon_tips = "Great photo opportunities."

            # Evening activity (dining & leisure)
            evening_title = f"Gourmet Dining & Sunset Stroll at {destination.city} Harbor/Promenade"
            evening_desc = f"Sample signature regional delicacies and relax in the evening ambiance."
            evening_cost = round(20.0 * travelers_count, 2)
            evening_category = "Dining & Leisure"
            evening_tips = "Reservations recommended for popular dining spots."

            day_activities_cost = morning_cost + afternoon_cost
            actual_activities_cost += day_activities_cost

            daily_schedule.append({
                'day': day_num,
                'date': curr_date,
                'theme': f"Day {day_num}: {destination.city} Highlights & {morning_category}",
                'morning': {
                    'time': '09:00 AM - 12:30 PM',
                    'title': morning_title,
                    'category': morning_category,
                    'description': morning_desc,
                    'cost_usd': round(morning_cost, 2),
                    'insider_tip': morning_tips
                },
                'afternoon': {
                    'time': '01:30 PM - 05:00 PM',
                    'title': afternoon_title,
                    'category': afternoon_category,
                    'description': afternoon_desc,
                    'cost_usd': round(afternoon_cost, 2),
                    'insider_tip': afternoon_tips
                },
                'evening': {
                    'time': '06:30 PM - 09:30 PM',
                    'title': evening_title,
                    'category': evening_category,
                    'description': evening_desc,
                    'cost_usd': round(evening_cost, 2),
                    'insider_tip': evening_tips
                },
                'day_total_cost': round(day_activities_cost + evening_cost, 2)
            })

        actual_dining_cost = round(allocated_dining, 2)
        actual_buffer_cost = round(allocated_buffer, 2)

        total_estimated_cost = round(
            actual_flight_cost + actual_hotel_cost + actual_activities_cost + actual_dining_cost + actual_buffer_cost,
            2
        )

        cost_breakdown = {
            'flights': actual_flight_cost,
            'hotel': actual_hotel_cost,
            'activities': round(actual_activities_cost, 2),
            'dining': actual_dining_cost,
            'contingency_buffer': actual_buffer_cost
        }

        # Budget Feasibility Assessment
        variance = round(budget - total_estimated_cost, 2)
        if variance >= 0:
            feasibility_status = "Optimal (Within Budget)"
            budget_advice = f"Your itinerary is fully funded! You have a surplus of ${variance:.2f} which can be used for souvenirs or room upgrades."
        else:
            feasibility_status = "Budget Stretch Required"
            budget_advice = f"This itinerary exceeds your target budget by ${abs(variance):.2f}. Consider selecting our 3-star partner hotel or booking flights with a stopover to save."

        title = f"{duration_days}-Day {travel_style} Journey in {destination.city}"

        return {
            'title': title,
            'destination_id': destination.id,
            'destination_name': destination.name,
            'destination_city': destination.city,
            'destination_country': destination.country,
            'destination_image': destination.image_url,
            'origin_city': origin_city,
            'start_date': start_date_str,
            'duration_days': duration_days,
            'travelers_count': travelers_count,
            'total_budget': budget,
            'estimated_cost': total_estimated_cost,
            'budget_variance': variance,
            'feasibility_status': feasibility_status,
            'budget_advice': budget_advice,
            'travel_style': travel_style,
            'accommodation_tier': accommodation_tier,
            'cost_breakdown': cost_breakdown,
            'daily_schedule': daily_schedule,
            'selected_flight': selected_flight,
            'selected_hotel': selected_hotel
        }
