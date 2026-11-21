import unittest
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, Destination, TouristAttraction, Hotel, FlightOffer
from app.services.itinerary_generator import ItineraryGenerator

class BudgetPlannerTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Seed minimal test destination and hotel
        dest = Destination(
            name='Paris, France',
            city='Paris',
            country='France',
            continent='Europe',
            airport_code='CDG',
            description='City of Light',
            image_url='https://example.com/paris.jpg',
            best_time_to_visit='May to October',
            climate='Mild',
            avg_cost_per_day_budget=90.0,
            avg_cost_per_day_mid=200.0,
            avg_cost_per_day_luxury=500.0,
            tags=json.dumps(['culture', 'foodie', 'sightseeing'])
        )
        db.session.add(dest)
        db.session.flush()

        attr = TouristAttraction(
            destination_id=dest.id,
            name='Eiffel Tower',
            category='Sightseeing',
            description='Iconic landmark',
            image_url='https://example.com/eiffel.jpg',
            estimated_duration_hours=2.0,
            ticket_price_usd=25.0
        )
        hotel = Hotel(
            destination_id=dest.id,
            name='Paris Partner Hotel',
            city='Paris',
            country='France',
            address='10 Rue Paris',
            stars=4,
            description='Comfortable boutique hotel',
            image_url='https://example.com/hotel.jpg',
            standard_rate_per_night=200.0,
            is_partner=True,
            partner_discount_percent=20.0, # Partner rate = 160.0
            jbd_commission_percent=12.0
        )
        hotel.set_amenities_list(['Free Wi-Fi', 'Breakfast'])
        hotel.set_room_types_list([{'name': 'Deluxe', 'multiplier': 1.0}])

        db.session.add_all([attr, hotel])
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_budget_itinerary_generation(self):
        plan = ItineraryGenerator.generate_plan(
            destination_id_or_name='Paris',
            budget=2500.0,
            duration_days=5,
            travelers_count=1,
            travel_style='Cultural & Sightseeing',
            accommodation_tier='Comfort (3-4 Star)'
        )

        self.assertIsNotNone(plan)
        self.assertEqual(plan['duration_days'], 5)
        self.assertEqual(plan['travelers_count'], 1)
        self.assertEqual(plan['destination_city'], 'Paris')
        self.assertIn('cost_breakdown', plan)

        breakdown = plan['cost_breakdown']
        calculated_total = round(
            breakdown['flights'] + breakdown['hotel'] + breakdown['activities'] + breakdown['dining'] + breakdown['contingency_buffer'],
            2
        )
        self.assertAlmostEqual(plan['estimated_cost'], calculated_total, places=1)
        self.assertEqual(len(plan['daily_schedule']), 5)
        self.assertIn('morning', plan['daily_schedule'][0])
        self.assertIn('afternoon', plan['daily_schedule'][0])
        self.assertIn('evening', plan['daily_schedule'][0])

    def test_budget_feasibility_variance(self):
        # Generous budget
        plan_generous = ItineraryGenerator.generate_plan('Paris', budget=5000.0, duration_days=3)
        self.assertEqual(plan_generous['feasibility_status'], 'Optimal (Within Budget)')
        self.assertGreaterEqual(plan_generous['budget_variance'], 0)

        # Very low budget
        plan_tight = ItineraryGenerator.generate_plan('Paris', budget=300.0, duration_days=7)
        self.assertEqual(plan_tight['feasibility_status'], 'Budget Stretch Required')
        self.assertLess(plan_tight['budget_variance'], 0)

if __name__ == '__main__':
    unittest.main()
