import unittest
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, Hotel, FlightOffer
from app.services.flight_service import FlightService
from app.services.hotel_service import HotelService

class PriceComparisonTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Seed flights
        f1 = FlightOffer(
            origin_code='JFK', origin_city='New York',
            destination_code='CDG', destination_city='Paris',
            airline_name='Carrier A', flight_number='CA-1',
            departure_time='08:00', arrival_time='16:00', duration_minutes=480,
            stops=0, cabin_class='Economy', base_price_usd=500.0, tax_usd=50.0
        )
        f2 = FlightOffer(
            origin_code='JFK', origin_city='New York',
            destination_code='CDG', destination_city='Paris',
            airline_name='Carrier B', flight_number='CB-2',
            departure_time='10:00', arrival_time='20:00', duration_minutes=600,
            stops=1, cabin_class='Economy', base_price_usd=400.0, tax_usd=40.0
        )
        db.session.add_all([f1, f2])

        # Seed hotel
        h = Hotel(
            name='Grand Luxury Palace',
            city='Paris',
            country='France',
            address='123 Avenue Paris',
            stars=5,
            description='5-star luxury palace',
            image_url='https://example.com/h.jpg',
            standard_rate_per_night=400.0,
            is_partner=True,
            partner_discount_percent=20.0, # 20% discount => partner rate = 320.0
            jbd_commission_percent=15.0    # 15% commission => 48.0 per night
        )
        h.set_amenities_list(['Free Wi-Fi', 'Spa', 'Pool'])
        h.set_room_types_list([{'name': 'Executive', 'multiplier': 1.0}])
        db.session.add(h)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_flight_price_comparison_and_badges(self):
        res = FlightService.search_flights(origin_city='New York', destination_city='Paris')
        self.assertEqual(res['total_found'], 2)
        self.assertTrue(res['is_simulated'])
        self.assertIn('flights', res)

        flights = res['flights']
        cheapest_flight = next(f for f in flights if f['flight_number'] == 'CB-2')
        fastest_flight = next(f for f in flights if f['flight_number'] == 'CA-1')

        # Total prices
        self.assertEqual(cheapest_flight['total_price_usd'], 440.0)
        self.assertEqual(fastest_flight['total_price_usd'], 550.0)

        # Badge verification
        badge_types_cheapest = [b['type'] for b in cheapest_flight.get('badges', [])]
        self.assertIn('cheapest', badge_types_cheapest)

        badge_types_fastest = [b['type'] for b in fastest_flight.get('badges', [])]
        self.assertIn('fastest', badge_types_fastest)

    def test_hotel_price_comparison_and_commission_math(self):
        hotels = HotelService.search_hotels(destination_query='Paris')
        self.assertEqual(len(hotels), 1)

        hotel = hotels[0]
        self.assertEqual(hotel['standard_rate_per_night'], 400.0)
        self.assertEqual(hotel['jbd_partner_rate'], 320.0)
        self.assertEqual(hotel['savings_per_night'], 80.0)
        self.assertEqual(hotel['commission_per_night'], 48.0)

        comparison = hotel['price_comparison']
        self.assertIn('booking_com_rate', comparison)
        self.assertIn('expedia_rate', comparison)
        self.assertIn('customer_savings_vs_competitor', comparison)
        self.assertGreater(comparison['customer_savings_vs_competitor'], 0)

if __name__ == '__main__':
    unittest.main()
