import unittest
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, TravelDocRequirement
from app.services.travel_doc_service import TravelDocService

class TravelDocsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        rule = TravelDocRequirement(
            origin_country='United States',
            destination_country='Japan',
            visa_requirement_type='Visa Free',
            max_stay_days=90,
            passport_validity_months=6,
            entry_procedures='Complete Visit Japan Web QR form',
            official_portal_url='https://vjw-lp.digital.go.jp/en/',
            estimated_processing_days=0,
            estimated_fee_usd=0.0
        )
        rule.set_required_documents_list(['Valid Passport', 'Return Ticket'])
        db.session.add(rule)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_database_exact_match(self):
        advisory = TravelDocService.get_requirement('United States', 'Japan')
        self.assertIsNotNone(advisory)
        self.assertEqual(advisory['visa_requirement_type'], 'Visa Free')
        self.assertEqual(advisory['passport_validity_months'], 6)
        self.assertIn('official_portal_url', advisory)
        self.assertIn('Valid Passport', advisory['required_documents'])

    def test_intelligent_fallback_schengen(self):
        # Origin USA visiting Italy (not in db, triggers intelligent fallback)
        advisory = TravelDocService.get_requirement('United States', 'Italy')
        self.assertIsNotNone(advisory)
        self.assertIn('Schengen', advisory['visa_requirement_type'])
        self.assertEqual(advisory['max_stay_days'], 90)

if __name__ == '__main__':
    unittest.main()
