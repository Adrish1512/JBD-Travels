import json
from datetime import datetime
from . import db

class TravelDocRequirement(db.Model):
    __tablename__ = 'travel_doc_requirements'

    id = db.Column(db.Integer, primary_key=True)
    origin_country = db.Column(db.String(100), nullable=False, index=True)         # Citizen / Passport of
    destination_country = db.Column(db.String(100), nullable=False, index=True)    # Traveling to
    destination_city = db.Column(db.String(100), nullable=True)
    visa_requirement_type = db.Column(db.String(50), nullable=False)               # 'Visa Free', 'eVisa', 'Visa on Arrival', 'Embassy Visa Required'
    max_stay_days = db.Column(db.Integer, default=90)
    passport_validity_months = db.Column(db.Integer, default=6)                    # Most countries require 6 months
    blank_passport_pages_needed = db.Column(db.Integer, default=2)
    mandatory_vaccines = db.Column(db.String(255), default='None routinely required')
    entry_procedures = db.Column(db.Text, nullable=False)                          # Details on customs, declaration cards, biometric scan
    official_portal_url = db.Column(db.String(500), nullable=False)                 # Official government immigration URL
    embassy_info = db.Column(db.Text, nullable=True)
    estimated_processing_days = db.Column(db.Integer, default=3)
    estimated_fee_usd = db.Column(db.Float, default=0.0)
    required_documents = db.Column(db.Text, nullable=True)                         # JSON list: ['Valid Passport', 'Return Flight Ticket', 'Hotel Booking Proof', 'Proof of Funds']
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_required_documents_list(self):
        try:
            return json.loads(self.required_documents) if self.required_documents else []
        except Exception:
            return [d.strip() for d in self.required_documents.split(',') if d.strip()]

    def set_required_documents_list(self, doc_list):
        self.required_documents = json.dumps(doc_list)

    def to_dict(self):
        return {
            'id': self.id,
            'origin_country': self.origin_country,
            'destination_country': self.destination_country,
            'destination_city': self.destination_city or '',
            'visa_requirement_type': self.visa_requirement_type,
            'max_stay_days': self.max_stay_days,
            'passport_validity_months': self.passport_validity_months,
            'blank_passport_pages_needed': self.blank_passport_pages_needed,
            'mandatory_vaccines': self.mandatory_vaccines,
            'entry_procedures': self.entry_procedures,
            'official_portal_url': self.official_portal_url,
            'embassy_info': self.embassy_info or '',
            'estimated_processing_days': self.estimated_processing_days,
            'estimated_fee_usd': self.estimated_fee_usd,
            'required_documents': self.get_required_documents_list()
        }
