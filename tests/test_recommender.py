import unittest
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, Destination, TouristAttraction
from app.services.ai_recommender import AIRecommender, vectorize_tags

class RecommenderTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        dest_bali = Destination(
            name='Bali, Indonesia',
            city='Bali',
            country='Indonesia',
            continent='Asia',
            airport_code='DPS',
            description='Tropical island paradise',
            image_url='https://example.com/bali.jpg',
            best_time_to_visit='May to Sept',
            climate='Tropical',
            avg_cost_per_day_budget=50.0,
            avg_cost_per_day_mid=120.0,
            avg_cost_per_day_luxury=300.0,
            tags=json.dumps(['adventure', 'nature', 'relaxation', 'beaches'])
        )
        dest_tokyo = Destination(
            name='Tokyo, Japan',
            city='Tokyo',
            country='Japan',
            continent='Asia',
            airport_code='HND',
            description='Metropolis of modern and ancient',
            image_url='https://example.com/tokyo.jpg',
            best_time_to_visit='Spring and Autumn',
            climate='Temperate',
            avg_cost_per_day_budget=80.0,
            avg_cost_per_day_mid=180.0,
            avg_cost_per_day_luxury=450.0,
            tags=json.dumps(['culture', 'foodie', 'shopping', 'sightseeing'])
        )
        db.session.add_all([dest_bali, dest_tokyo])
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_vectorize_tags(self):
        tags = ['adventure', 'nature']
        vec = vectorize_tags(tags)
        self.assertEqual(len(vec), 12)
        self.assertEqual(vec[0], 1.0) # 'adventure' is at index 0

    def test_adventure_recommendations_rank_bali_first(self):
        recs = AIRecommender.recommend_destinations(
            user_preferences=['adventure', 'nature', 'beaches'],
            user_budget=1500.0,
            duration_days=7
        )
        self.assertGreater(len(recs), 0)
        # Bali should rank #1 for adventure + nature + beaches
        self.assertEqual(recs[0]['destination']['city'], 'Bali')
        self.assertGreaterEqual(recs[0]['match_percentage'], 70)
        self.assertIn('why_recommended', recs[0])

    def test_culture_foodie_recommendations_rank_tokyo_first(self):
        recs = AIRecommender.recommend_destinations(
            user_preferences=['culture', 'foodie', 'shopping'],
            user_budget=2000.0,
            duration_days=5
        )
        self.assertGreater(len(recs), 0)
        self.assertEqual(recs[0]['destination']['city'], 'Tokyo')
        self.assertIn('matched_tags', recs[0])

if __name__ == '__main__':
    unittest.main()
