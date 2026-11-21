from ..models import TravelDocRequirement, Destination

class TravelDocService:
    """
    Passport, Visa and Destination Entry Requirement Engine for JBD Travels
    Provides official guidelines, passport validity thresholds, and direct official embassy/immigration portals.
    """

    DEFAULT_OFFICIAL_PORTALS = {
        'Japan': 'https://www.mofa.go.jp/j_info/visit/visa/index.html',
        'France': 'https://france-visas.gouv.fr/',
        'Indonesia': 'https://molina.imigrasi.go.id/',
        'United Arab Emirates': 'https://u.ae/en/information-and-services/visa-and-emirates-id',
        'Italy': 'https://vistoperitalia.esteri.it/home/en',
        'Thailand': 'https://thaievisa.go.th/',
        'United States': 'https://travel.state.gov/content/travel/en/us-visas.html',
        'United Kingdom': 'https://www.gov.uk/check-uk-visa',
        'South Africa': 'http://www.dha.gov.za/index.php/immigration-services',
        'Australia': 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder',
        'Singapore': 'https://www.ica.gov.sg/enter-transit-depart',
        'Egypt': 'https://visa2egypt.gov.eg/'
    }

    @classmethod
    def get_requirement(cls, origin_country, destination_country):
        """Looks up specific entry requirements between origin citizenship and destination"""
        if not origin_country or not destination_country:
            return None

        req = TravelDocRequirement.query.filter(
            TravelDocRequirement.origin_country.ilike(f"%{origin_country}%"),
            TravelDocRequirement.destination_country.ilike(f"%{destination_country}%")
        ).first()

        if req:
            return req.to_dict()

        # Intelligent Fallback Rules Engine
        return cls._generate_standard_entry_advisory(origin_country, destination_country)

    @classmethod
    def _generate_standard_entry_advisory(cls, origin, destination):
        portal = cls.DEFAULT_OFFICIAL_PORTALS.get(destination, 'https://www.iatatravelcentre.com/')
        
        # Determine visa type heuristics
        schengen_countries = ['France', 'Italy', 'Spain', 'Germany', 'Greece', 'Netherlands', 'Switzerland']
        visa_free_strong_passports = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore']

        if destination in schengen_countries and origin in visa_free_strong_passports:
            visa_type = "Visa Free (Schengen Area)"
            max_stay = 90
            fee = 0.0
            proc_days = 0
            procedures = f"Passport holders of {origin} do not require an advance visa for short tourism stays of up to 90 days in {destination} within any 180-day period. Valid passport with at least 3 months validity beyond intended departure date required."
        elif destination in ['Indonesia', 'Egypt', 'Thailand'] and origin in visa_free_strong_passports:
            visa_type = "eVisa / Visa on Arrival (VoA)"
            max_stay = 30
            fee = 35.0
            proc_days = 1
            procedures = f"Travelers from {origin} can conveniently obtain an Electronic Visa (e-Visa) online prior to departure or a Visa on Arrival at international airport immigration counters in {destination}."
        elif origin in visa_free_strong_passports and destination in ['United Arab Emirates', 'Singapore']:
            visa_type = "Visa Free Entry"
            max_stay = 30
            fee = 0.0
            proc_days = 0
            procedures = f"Complimentary 30-day tourist entry stamp issued upon arrival at international border control in {destination}."
        else:
            visa_type = "eVisa or Consular Visa Required"
            max_stay = 30
            fee = 85.0
            proc_days = 7
            procedures = f"Citizens of {origin} require a formal tourist visa before entering {destination}. Please complete an online application via the official immigration authority or schedule an appointment at the nearest embassy/consulate."

        return {
            'origin_country': origin,
            'destination_country': destination,
            'visa_requirement_type': visa_type,
            'max_stay_days': max_stay,
            'passport_validity_months': 6,
            'blank_passport_pages_needed': 2,
            'mandatory_vaccines': 'Standard routine vaccines. Proof of Yellow Fever required if arriving from endemic countries.',
            'entry_procedures': procedures,
            'official_portal_url': portal,
            'embassy_info': f"Embassy & Consular Services for {destination} - check official consulate listing.",
            'estimated_processing_days': proc_days,
            'estimated_fee_usd': fee,
            'required_documents': [
                'Valid passport (minimum 6 months remaining validity)',
                'Confirmed return or onward flight ticket',
                'Proof of accommodation (hotel voucher or host letter)',
                'Adequate travel funds / bank statement',
                'Comprehensive travel health insurance (strongly recommended)'
            ]
        }
