from datetime import datetime, timedelta
import random
from ..models import FlightOffer, Destination

class FlightService:
    """
    Flight Search & Price Comparison Engine for JBD Travels
    Supports multi-carrier comparisons, sorting by Cheapest, Fastest, Best Value,
    and clearly identifies Simulated vs Live API data sources.
    """

    @classmethod
    def search_flights(cls, origin_city=None, destination_city=None, cabin_class='Economy', 
                       stops_filter=None, max_price=None, sort_by='price'):
        query = FlightOffer.query

        if origin_city:
            query = query.filter(FlightOffer.origin_city.ilike(f"%{origin_city}%"))
        
        if destination_city:
            query = query.filter(
                (FlightOffer.destination_city.ilike(f"%{destination_city}%")) |
                (FlightOffer.destination_code.ilike(f"%{destination_city}%"))
            )

        if cabin_class and cabin_class != 'All':
            query = query.filter(FlightOffer.cabin_class.ilike(f"%{cabin_class}%"))

        if stops_filter is not None and stops_filter != '':
            try:
                query = query.filter(FlightOffer.stops == int(stops_filter))
            except Exception:
                pass

        if max_price:
            try:
                query = query.filter((FlightOffer.base_price_usd + FlightOffer.tax_usd) <= float(max_price))
            except Exception:
                pass

        results = query.all()

        # If no exact DB match, generate high-fidelity simulated flight offers for any requested route
        if not results and destination_city:
            results = cls._generate_dynamic_flight_offers(origin_city or 'New York', destination_city, cabin_class)

        flight_list = [f.to_dict() if hasattr(f, 'to_dict') else f for f in results]

        if not flight_list:
            # Fallback to returning all available flights
            flight_list = [f.to_dict() for f in FlightOffer.query.limit(10).all()]

        # Compute Badges: Cheapest, Fastest, Best Value
        if flight_list:
            cheapest = min(flight_list, key=lambda x: x['total_price_usd'])
            fastest = min(flight_list, key=lambda x: x['duration_minutes'])
            
            # Best value score = (duration_mins * 0.4) + (price * 0.6)
            best_value = min(flight_list, key=lambda x: (x['duration_minutes'] * 0.4) + (x['total_price_usd'] * 0.6))

            for f in flight_list:
                f['badges'] = []
                if f['id'] == cheapest['id']:
                    f['badges'].append({'type': 'cheapest', 'label': 'Cheapest Option', 'color': 'emerald'})
                if f['id'] == fastest['id']:
                    f['badges'].append({'type': 'fastest', 'label': 'Fastest Route', 'color': 'blue'})
                if f['id'] == best_value['id'] and f['id'] != cheapest['id'] and f['id'] != fastest['id']:
                    f['badges'].append({'type': 'value', 'label': 'Best Value', 'color': 'purple'})

        # Sorting
        if sort_by == 'price':
            flight_list.sort(key=lambda x: x['total_price_usd'])
        elif sort_by == 'duration':
            flight_list.sort(key=lambda x: x['duration_minutes'])
        elif sort_by == 'stops':
            flight_list.sort(key=lambda x: x['stops'])
        elif sort_by == 'departure':
            flight_list.sort(key=lambda x: x['departure_time'])

        return {
            'data_source': 'JBD Global Distribution Mock API (Simulated)',
            'is_simulated': True,
            'notice': 'Flight availability and rates generated via JBD GDS Engine. External live API toggle supported via environment configuration.',
            'total_found': len(flight_list),
            'flights': flight_list
        }

    @classmethod
    def _generate_dynamic_flight_offers(cls, origin, destination, cabin_class='Economy'):
        carriers = [
            {'name': 'Emirates', 'code': 'EK', 'logo': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100'},
            {'name': 'Qatar Airways', 'code': 'QR', 'logo': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=100'},
            {'name': 'Singapore Airlines', 'code': 'SQ', 'logo': 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=100'},
            {'name': 'British Airways', 'code': 'BA', 'logo': 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=100'},
            {'name': 'Delta Air Lines', 'code': 'DL', 'logo': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100'},
            {'name': 'Lufthansa', 'code': 'LH', 'logo': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100'}
        ]

        base_multiplier = {'Economy': 1.0, 'Premium Economy': 1.6, 'Business': 3.2, 'First': 5.5}.get(cabin_class, 1.0)
        
        simulated = []
        for i, carrier in enumerate(carriers):
            stops = 0 if i in [0, 2, 4] else 1
            duration_base = 450 + (i * 45) + (stops * 130)
            base_price = round((380 + (i * 65) + random.randint(10, 40)) * base_multiplier, 2)
            tax = round(45.0 + (i * 4.5), 2)
            total = round(base_price + tax, 2)
            flight_num = f"{carrier['code']}-{random.randint(100, 999)}"

            dep_hour = 6 + (i * 3)
            arr_hour = (dep_hour + (duration_base // 60)) % 24

            hours = duration_base // 60
            mins = duration_base % 60

            simulated.append({
                'id': f"dyn-{i+1}",
                'origin_code': 'ORG',
                'origin_city': origin,
                'destination_code': 'DST',
                'destination_city': destination,
                'airline_name': carrier['name'],
                'airline_logo': carrier['logo'],
                'flight_number': flight_num,
                'departure_time': f"{dep_hour:02d}:15",
                'arrival_time': f"{arr_hour:02d}:45",
                'duration_minutes': duration_base,
                'duration_formatted': f"{hours}h {mins}m",
                'stops': stops,
                'stop_cities': 'Direct' if stops == 0 else f"{carrier['name']} Hub (1 stop)",
                'cabin_class': cabin_class,
                'base_price_usd': base_price,
                'tax_usd': tax,
                'total_price_usd': total,
                'baggage_allowance': '2 x 23kg checked bags' if 'Business' in cabin_class else '1 x 23kg checked bag',
                'is_simulated': True,
                'data_source_label': 'JBD Global GDS Simulation',
                'aircraft_type': 'Boeing 787-9 / Airbus A350',
                'available_seats': 4 + (i * 2)
            })

        return simulated
