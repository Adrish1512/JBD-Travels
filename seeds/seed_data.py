import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import (
    db, User, Destination, TouristAttraction, Hotel, 
    FlightOffer, Itinerary, BookingInquiry, TravelDocRequirement, SystemSetting
)

def seed_database():
    app = create_app()
    with app.app_context():
        print("Recreating database tables...")
        db.drop_all()
        db.create_all()

        print("Seeding System Settings...")
        settings = [
            SystemSetting(key='default_commission_percent', value='12.0', description='Default JBD Travel Agency Commission %'),
            SystemSetting(key='default_discount_percent', value='15.0', description='Default Partner Hotel Discount %'),
            SystemSetting(key='agency_name', value='JBD Travels Global Concierge', description='Company Branding Name'),
            SystemSetting(key='support_hotline', value='+1 (800) 523-8728', description='24/7 Traveler Hotline'),
            SystemSetting(key='support_email', value='concierge@jbdtravels.com', description='Customer Support Email')
        ]
        db.session.add_all(settings)

        print("Seeding Users...")
        admin = User(
            username='admin',
            email='admin@jbdtravels.com',
            full_name='Sarah Jenkins',
            role='admin',
            nationality='United States',
            phone='+1 (555) 234-5678'
        )
        admin.set_password('Admin123!')

        employee = User(
            username='agent',
            email='agent@jbdtravels.com',
            full_name='Marcus Vance',
            role='employee',
            nationality='United Kingdom',
            phone='+44 20 7946 0912'
        )
        employee.set_password('Agent123!')

        customer = User(
            username='customer',
            email='customer@jbdtravels.com',
            full_name='Elena Rostova',
            role='customer',
            nationality='United States',
            phone='+1 (555) 987-6543'
        )
        customer.set_password('Customer123!')

        db.session.add_all([admin, employee, customer])
        db.session.commit()

        print("Seeding Destinations and Attractions...")
        destinations_data = [
            {
                'name': 'Tokyo, Japan',
                'city': 'Tokyo',
                'country': 'Japan',
                'continent': 'Asia',
                'airport_code': 'HND',
                'description': 'A vibrant metropolis blending ultra-modern neon-lit skyscrapers with historic temples, world-class gastronomy, and impeccable hospitality.',
                'image_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1600',
                'best_time_to_visit': 'March to May & September to November',
                'climate': 'Temperate / Four distinct seasons',
                'avg_cost_per_day_budget': 85.0,
                'avg_cost_per_day_mid': 195.0,
                'avg_cost_per_day_luxury': 480.0,
                'tags': ['culture', 'sightseeing', 'foodie', 'shopping', 'nightlife', 'adventure'],
                'safety_rating': 4.9,
                'currency_code': 'JPY',
                'languages': 'Japanese, English in transit',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'Senso-ji Temple & Asakusa',
                        'category': 'Cultural',
                        'description': 'Tokyo\'s oldest and most sacred Buddhist temple, featuring the majestic Kaminarimon Thunder Gate and traditional Nakamise shopping arcade.',
                        'image_url': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600',
                        'estimated_duration_hours': 2.5,
                        'ticket_price_usd': 0.0,
                        'rating': 4.8,
                        'address_or_location': '2-3-1 Asakusa, Taito City, Tokyo',
                        'tips': 'Arrive before 9 AM for peaceful photos without crowd.'
                    },
                    {
                        'name': 'teamLab Planets Digital Art Museum',
                        'category': 'Sightseeing',
                        'description': 'An immersive, world-renowned sensory digital art space where visitors walk through water and colossal interactive light gardens.',
                        'image_url': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600',
                        'estimated_duration_hours': 2.0,
                        'ticket_price_usd': 28.0,
                        'rating': 4.9,
                        'address_or_location': 'Toyosu, Koto City, Tokyo',
                        'tips': 'Book tickets 3 weeks ahead; wear pants that easily roll above the knees.'
                    },
                    {
                        'name': 'Shibuya Crossing & Hachiko Statue',
                        'category': 'Sightseeing',
                        'description': 'The world\'s busiest pedestrian intersection, pulsing with giant video screens and kinetic neon energy.',
                        'image_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
                        'estimated_duration_hours': 1.5,
                        'ticket_price_usd': 0.0,
                        'rating': 4.7,
                        'address_or_location': 'Shibuya Station Hachiko Exit',
                        'tips': 'Great view from the Shibuya Sky observation deck at dusk.'
                    },
                    {
                        'name': 'Tsukiji Outer Market Food Tour',
                        'category': 'Dining',
                        'description': 'Lively maze of fresh sushi stands, wagyu skewers, tamagoyaki omelet vendors, and specialty culinary shops.',
                        'image_url': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600',
                        'estimated_duration_hours': 2.0,
                        'ticket_price_usd': 22.0,
                        'rating': 4.8,
                        'address_or_location': '4 Chome Tsukiji, Chuo City, Tokyo',
                        'tips': 'Best enjoyed between 8:30 AM and 11:30 AM.'
                    }
                ]
            },
            {
                'name': 'Paris, France',
                'city': 'Paris',
                'country': 'France',
                'continent': 'Europe',
                'airport_code': 'CDG',
                'description': 'The City of Light, celebrated for its neoclassical architecture, haute couture fashion, iconic museums, romantic boulevards, and Michelin-starred cuisine.',
                'image_url': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600',
                'best_time_to_visit': 'April to June & September to November',
                'climate': 'Oceanic / Mild summers and cool winters',
                'avg_cost_per_day_budget': 95.0,
                'avg_cost_per_day_mid': 230.0,
                'avg_cost_per_day_luxury': 550.0,
                'tags': ['culture', 'sightseeing', 'foodie', 'romantic', 'luxury', 'heritage'],
                'safety_rating': 4.6,
                'currency_code': 'EUR',
                'languages': 'French, English widely understood',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'Eiffel Tower & Champ de Mars',
                        'category': 'Sightseeing',
                        'description': 'Gustave Eiffel\'s iron lattice monument standing 330 meters above the Seine, illuminated by 20,000 sparkling lights every evening.',
                        'image_url': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600',
                        'estimated_duration_hours': 2.5,
                        'ticket_price_usd': 30.0,
                        'rating': 4.7,
                        'address_or_location': 'Champ de Mars, 5 Av. Anatole France, Paris',
                        'tips': 'Summit elevator ticket recommended; book at sunset.'
                    },
                    {
                        'name': 'Louvre Museum',
                        'category': 'Cultural',
                        'description': 'The world\'s largest art museum, home to Leonardo da Vinci\'s Mona Lisa, the Venus de Milo, and over 35,000 historic masterpieces.',
                        'image_url': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',
                        'estimated_duration_hours': 3.5,
                        'ticket_price_usd': 24.0,
                        'rating': 4.8,
                        'address_or_location': 'Rue de Rivoli, 75001 Paris',
                        'tips': 'Enter via the Carrousel du Louvre underground mall to skip the pyramid line.'
                    },
                    {
                        'name': 'Montmartre & Sacré-Cœur Basilica',
                        'category': 'Sightseeing',
                        'description': 'Historic hilltop artists\' quarter with cobblestone alleys, charming cafes, and panoramic vista over Paris.',
                        'image_url': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=600',
                        'estimated_duration_hours': 2.5,
                        'ticket_price_usd': 0.0,
                        'rating': 4.7,
                        'address_or_location': '35 Rue du Chevalier de la Barre, Paris',
                        'tips': 'Climb the dome of Sacré-Cœur for the 2nd highest vantage point in Paris.'
                    }
                ]
            },
            {
                'name': 'Bali, Indonesia',
                'city': 'Bali',
                'country': 'Indonesia',
                'continent': 'Asia',
                'airport_code': 'DPS',
                'description': 'An enchanting Indonesian paradise famed for emerald rice terraces, spiritual Hindu sea temples, coral reefs, surf breaks, and world-class wellness retreats.',
                'image_url': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600',
                'best_time_to_visit': 'April to October (Dry Season)',
                'climate': 'Tropical warm and humid',
                'avg_cost_per_day_budget': 45.0,
                'avg_cost_per_day_mid': 110.0,
                'avg_cost_per_day_luxury': 320.0,
                'tags': ['adventure', 'relaxation', 'nature', 'beaches', 'culture', 'romantic'],
                'safety_rating': 4.7,
                'currency_code': 'IDR',
                'languages': 'Indonesian, Balinese, English widely spoken',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'Tegallalang Rice Terraces & Jungle Swing',
                        'category': 'Nature',
                        'description': 'Cascading emerald green rice paddies sculpted along the Ubud river valley with iconic jungle canopy swings.',
                        'image_url': 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600',
                        'estimated_duration_hours': 2.5,
                        'ticket_price_usd': 8.0,
                        'rating': 4.7,
                        'address_or_location': 'Jl. Raya Tegallalang, Ubud, Bali',
                        'tips': 'Visit early in the morning before 8 AM for misty rays of sunlight.'
                    },
                    {
                        'name': 'Uluwatu Cliff Temple & Kecak Fire Dance',
                        'category': 'Cultural',
                        'description': 'Dramatic sea temple perched on a 70-meter cliff above crashing Indian Ocean waves, featuring evening Kecak chorus performances.',
                        'image_url': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
                        'estimated_duration_hours': 3.0,
                        'ticket_price_usd': 12.0,
                        'rating': 4.8,
                        'address_or_location': 'Pecatu, South Kuta, Badung Regency, Bali',
                        'tips': 'Watch out for playful monkeys near the temple entrance.'
                    },
                    {
                        'name': 'Mount Batur Sunrise Trekking',
                        'category': 'Adventure',
                        'description': 'Active volcanic hike starting at 3 AM to witness a breathtaking sunrise above the clouds and Lake Batur caldera.',
                        'image_url': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600',
                        'estimated_duration_hours': 4.5,
                        'ticket_price_usd': 35.0,
                        'rating': 4.9,
                        'address_or_location': 'Kintamani, Bangli Regency, Bali',
                        'tips': 'Bring a warm jacket and flashlight; trail is steep but rewarding.'
                    }
                ]
            },
            {
                'name': 'Rome, Italy',
                'city': 'Rome',
                'country': 'Italy',
                'continent': 'Europe',
                'airport_code': 'FCO',
                'description': 'The Eternal City, where nearly 3,000 years of globally influential art, architecture, ancient ruins, and culinary tradition unfold at every turn.',
                'image_url': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1600',
                'best_time_to_visit': 'April to June & September to October',
                'climate': 'Mediterranean / Warm and sunny',
                'avg_cost_per_day_budget': 80.0,
                'avg_cost_per_day_mid': 200.0,
                'avg_cost_per_day_luxury': 470.0,
                'tags': ['culture', 'sightseeing', 'heritage', 'foodie', 'romantic'],
                'safety_rating': 4.5,
                'currency_code': 'EUR',
                'languages': 'Italian, English in tourism centers',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'The Colosseum & Roman Forum',
                        'category': 'Heritage',
                        'description': 'The largest ancient amphitheater ever built, stage to gladiatorial battles and the epic civic heart of ancient Rome.',
                        'image_url': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
                        'estimated_duration_hours': 3.0,
                        'ticket_price_usd': 22.0,
                        'rating': 4.8,
                        'address_or_location': 'Piazza del Colosseo, 1, Rome',
                        'tips': 'Book skip-the-line underground arena tickets.'
                    },
                    {
                        'name': 'Trevi Fountain & Spanish Steps',
                        'category': 'Sightseeing',
                        'description': 'Nicola Salvi\'s Baroque masterpiece where tossing a coin guarantees your return to Rome, followed by a stroll to the Piazza di Spagna.',
                        'image_url': 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600',
                        'estimated_duration_hours': 1.5,
                        'ticket_price_usd': 0.0,
                        'rating': 4.7,
                        'address_or_location': 'Piazza di Trevi, Rome',
                        'tips': 'Visit late at night when the fountain is spectacularly illuminated and quiet.'
                    }
                ]
            },
            {
                'name': 'Dubai, United Arab Emirates',
                'city': 'Dubai',
                'country': 'United Arab Emirates',
                'continent': 'Middle East',
                'airport_code': 'DXB',
                'description': 'A glamorous desert wonderland of record-shattering architecture, luxury shopping, gold souks, futuristic thrills, and Arabian desert safaris.',
                'image_url': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600',
                'best_time_to_visit': 'November to March',
                'climate': 'Subtropical desert / Sunny and pleasant winters',
                'avg_cost_per_day_budget': 90.0,
                'avg_cost_per_day_mid': 240.0,
                'avg_cost_per_day_luxury': 600.0,
                'tags': ['luxury', 'shopping', 'adventure', 'sightseeing', 'beaches'],
                'safety_rating': 4.9,
                'currency_code': 'AED',
                'languages': 'Arabic, English is the lingua franca',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'Burj Khalifa Observation Deck',
                        'category': 'Sightseeing',
                        'description': 'The world\'s tallest architectural marvel soaring 828 meters high, featuring observation decks on floors 124, 125, and 148.',
                        'image_url': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
                        'estimated_duration_hours': 2.0,
                        'ticket_price_usd': 45.0,
                        'rating': 4.8,
                        'address_or_location': '1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
                        'tips': 'Sunset slots between 5 PM and 6:30 PM provide golden hour desert views.'
                    },
                    {
                        'name': 'Desert Safari, Dune Bashing & Bedouin Camp',
                        'category': 'Adventure',
                        'description': '4x4 dune bashing across golden red sands, camel riding, sandboarding, and an open-air barbecue banquet under starry skies.',
                        'image_url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600',
                        'estimated_duration_hours': 5.0,
                        'ticket_price_usd': 60.0,
                        'rating': 4.9,
                        'address_or_location': 'Lahbab Desert Dunes, Dubai',
                        'tips': 'Wear sandals or shoes that easily shake off sand.'
                    }
                ]
            },
            {
                'name': 'Cape Town, South Africa',
                'city': 'Cape Town',
                'country': 'South Africa',
                'continent': 'Africa',
                'airport_code': 'CPT',
                'description': 'A breathtaking coastal crown where dramatic granite mountains plunge into two oceans, accompanied by world-class vineyards, penguins, and vibrant cultures.',
                'image_url': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
                'best_time_to_visit': 'October to April (Warm dry summer)',
                'climate': 'Mediterranean climate',
                'avg_cost_per_day_budget': 55.0,
                'avg_cost_per_day_mid': 130.0,
                'avg_cost_per_day_luxury': 350.0,
                'tags': ['adventure', 'nature', 'beaches', 'sightseeing', 'foodie'],
                'safety_rating': 4.3,
                'currency_code': 'ZAR',
                'languages': 'English, Afrikaans, Xhosa',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'Table Mountain Aerial Cableway',
                        'category': 'Nature',
                        'description': 'Ascend the rotating cable car to the flat-topped summit 1,086 meters above sea level for 360-degree views of the Cape Peninsula.',
                        'image_url': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600',
                        'estimated_duration_hours': 3.0,
                        'ticket_price_usd': 22.0,
                        'rating': 4.9,
                        'address_or_location': 'Tafelberg Rd, Table Mountain, Cape Town',
                        'tips': 'Check cable car weather status in the morning; clouds ("tablecloth") can roll in fast.'
                    },
                    {
                        'name': 'Boulders Beach African Penguin Colony',
                        'category': 'Nature',
                        'description': 'Sheltered cove of giant granite boulders where over 2,000 wild, endangered African penguins roam the sandy shoreline.',
                        'image_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
                        'estimated_duration_hours': 2.0,
                        'ticket_price_usd': 10.0,
                        'rating': 4.8,
                        'address_or_location': 'Kleintuin Rd, Simon\'s Town, Cape Town',
                        'tips': 'Use the raised wooden boardwalks to view nesting birds up close.'
                    }
                ]
            },
            {
                'name': 'Bangkok, Thailand',
                'city': 'Bangkok',
                'country': 'Thailand',
                'continent': 'Asia',
                'airport_code': 'BKK',
                'description': 'A sensory feast of glittering Buddhist stupas, canal longboats, world-famous street food stalls, rooftop cocktail bars, and energetic night markets.',
                'image_url': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1563492065599-3580f775d066?w=1600',
                'best_time_to_visit': 'November to February (Cooler season)',
                'climate': 'Tropical / Warm year-round',
                'avg_cost_per_day_budget': 40.0,
                'avg_cost_per_day_mid': 95.0,
                'avg_cost_per_day_luxury': 280.0,
                'tags': ['culture', 'foodie', 'adventure', 'nightlife', 'sightseeing'],
                'safety_rating': 4.6,
                'currency_code': 'THB',
                'languages': 'Thai, English widely spoken in tourist zones',
                'is_featured': False,
                'attractions': [
                    {
                        'name': 'The Grand Palace & Wat Phra Kaew',
                        'category': 'Cultural',
                        'description': 'The dazzling ceremonial residence of Siamese kings housing the sacred Emerald Buddha carved from a single block of jade.',
                        'image_url': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
                        'estimated_duration_hours': 2.5,
                        'ticket_price_usd': 15.0,
                        'rating': 4.7,
                        'address_or_location': 'Na Phra Lan Rd, Phra Borom Maha Ratchawang, Bangkok',
                        'tips': 'Strict dress code: shoulders and knees must be completely covered.'
                    }
                ]
            },
            {
                'name': 'New York City, USA',
                'city': 'New York',
                'country': 'United States',
                'continent': 'North America',
                'airport_code': 'JFK',
                'description': 'The premier global hub of finance, theatre, contemporary arts, and culinary innovation, anchored by Central Park and iconic skyline towers.',
                'image_url': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
                'banner_url': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1600',
                'best_time_to_visit': 'April to June & September to November',
                'climate': 'Humid continental / Four distinct seasons',
                'avg_cost_per_day_budget': 110.0,
                'avg_cost_per_day_mid': 280.0,
                'avg_cost_per_day_luxury': 650.0,
                'tags': ['sightseeing', 'culture', 'foodie', 'nightlife', 'shopping', 'luxury'],
                'safety_rating': 4.6,
                'currency_code': 'USD',
                'languages': 'English, hundreds of global languages spoken',
                'is_featured': True,
                'attractions': [
                    {
                        'name': 'Central Park & The Met Museum',
                        'category': 'Sightseeing',
                        'description': '843 acres of verdant meadows, tranquil lakes, and tree-lined paths, crowned by the Metropolitan Museum of Art.',
                        'image_url': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600',
                        'estimated_duration_hours': 3.5,
                        'ticket_price_usd': 30.0,
                        'rating': 4.9,
                        'address_or_location': '1000 5th Ave, New York, NY 10028',
                        'tips': 'Rent a bike or take a horse carriage ride near Sheep Meadow.'
                    }
                ]
            }
        ]

        created_destinations = {}
        for d_data in destinations_data:
            attractions_list = d_data.pop('attractions', [])
            tags_list = d_data.pop('tags', [])

            dest = Destination(**d_data)
            dest.set_tags_list(tags_list)
            db.session.add(dest)
            db.session.flush()

            created_destinations[dest.city] = dest

            for a_data in attractions_list:
                attr = TouristAttraction(destination_id=dest.id, **a_data)
                db.session.add(attr)

        db.session.commit()

        print("Seeding Partner Hotels (Module 5 & 7)...")
        hotels_data = [
            # Tokyo
            {
                'destination_city': 'Tokyo',
                'name': 'The Palace Hotel Tokyo (JBD Preferred Partner)',
                'stars': 5,
                'address': '1-1-1 Marunouchi, Chiyoda City, Tokyo',
                'description': 'Sophisticated luxury facing the Imperial Palace gardens, featuring 10 restaurants, an Evian wellness spa, and private balconies.',
                'image_url': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
                'standard_rate_per_night': 420.0,
                'is_partner': True,
                'partner_discount_percent': 20.0,
                'jbd_commission_percent': 12.0,
                'amenities': ['Free Wi-Fi', 'Luxury Spa', 'Imperial Garden View', 'Michelin-starred Dining', 'Indoor Heated Pool', 'Fitness Center'],
                'room_types': [{'name': 'Deluxe King with Balcony', 'multiplier': 1.0}, {'name': 'Imperial Suite', 'multiplier': 1.8}],
                'nearby_attractions': [{'name': 'Imperial Palace', 'distance': '0.3 km'}, {'name': 'Tokyo Station', 'distance': '0.7 km'}]
            },
            {
                'destination_city': 'Tokyo',
                'name': 'Hotel Gracery Shinjuku (Partner Boutique)',
                'stars': 4,
                'address': '1-19-1 Kabukicho, Shinjuku City, Tokyo',
                'description': 'Iconic hotel in the heart of buzzing Shinjuku, famous for its life-size Godzilla terrace and smart contemporary comfort.',
                'image_url': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
                'standard_rate_per_night': 165.0,
                'is_partner': True,
                'partner_discount_percent': 15.0,
                'jbd_commission_percent': 10.0,
                'amenities': ['Free High-Speed Wi-Fi', 'Breakfast Buffet', 'Concierge Desk', 'Subway Access (2 min)'],
                'room_types': [{'name': 'Standard Double', 'multiplier': 1.0}, {'name': 'Godzilla View Twin', 'multiplier': 1.25}],
                'nearby_attractions': [{'name': 'Shinjuku Gyoen', 'distance': '1.1 km'}, {'name': 'Omoide Yokocho', 'distance': '0.5 km'}]
            },
            # Paris
            {
                'destination_city': 'Paris',
                'name': 'Hôtel Plaza Athénée (JBD Luxury Collection)',
                'stars': 5,
                'address': '25 Avenue Montaigne, 75008 Paris',
                'description': 'Legendary haute couture palace on prestigious Avenue Montaigne with red geraniums, Eiffel Tower views, and Christian Dior spa.',
                'image_url': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
                'standard_rate_per_night': 680.0,
                'is_partner': True,
                'partner_discount_percent': 18.0,
                'jbd_commission_percent': 14.0,
                'amenities': ['Eiffel Tower Balcony', 'Dior Spa', 'Free Wi-Fi', 'Limousine Service', 'Gourmet Restaurant'],
                'room_types': [{'name': 'Superior Room', 'multiplier': 1.0}, {'name': 'Eiffel Suite Prestige', 'multiplier': 2.1}],
                'nearby_attractions': [{'name': 'Champs-Élysées', 'distance': '0.4 km'}, {'name': 'Eiffel Tower', 'distance': '1.3 km'}]
            },
            {
                'destination_city': 'Paris',
                'name': 'Le Marais Boutique Hotel',
                'stars': 4,
                'address': '18 Rue de Turenne, 75004 Paris',
                'description': 'Chic Parisian design hotel located among the art galleries, trendy cafes, and historic mansions of the Marais.',
                'image_url': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600',
                'standard_rate_per_night': 210.0,
                'is_partner': True,
                'partner_discount_percent': 15.0,
                'jbd_commission_percent': 11.0,
                'amenities': ['Free Wi-Fi', 'French Artisan Breakfast', 'Courtyard Garden', 'Air Conditioning'],
                'room_types': [{'name': 'Classic Parisienne', 'multiplier': 1.0}, {'name': 'Deluxe Courtyard', 'multiplier': 1.3}],
                'nearby_attractions': [{'name': 'Place des Vosges', 'distance': '0.2 km'}, {'name': 'Notre-Dame', 'distance': '1.4 km'}]
            },
            # Bali
            {
                'destination_city': 'Bali',
                'name': 'Ayana Resort & Rock Bar Bali (Partner Resort)',
                'stars': 5,
                'address': 'Karang Mas Estate, Jimbaran, Bali',
                'description': 'Award-winning 90-hectare cliff-top sanctuary with 12 swimming pools, private white sand beach, and the world-famous Rock Bar.',
                'image_url': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
                'standard_rate_per_night': 290.0,
                'is_partner': True,
                'partner_discount_percent': 22.0,
                'jbd_commission_percent': 15.0,
                'amenities': ['Private Ocean Beach', '12 Swimming Pools', 'Rock Bar Priority Access', 'Thalassotherapy Spa', 'Free Wi-Fi'],
                'room_types': [{'name': 'Ocean View Suite', 'multiplier': 1.0}, {'name': 'Cliff Ocean Villa with Pool', 'multiplier': 2.2}],
                'nearby_attractions': [{'name': 'Jimbaran Bay Seafood', 'distance': '2.0 km'}, {'name': 'Uluwatu Temple', 'distance': '12.0 km'}]
            },
            {
                'destination_city': 'Bali',
                'name': 'Ubud Valley Green Eco-Resort',
                'stars': 4,
                'address': 'Jl. Pejeng Kawan, Ubud, Bali',
                'description': 'Serene boutique villas overlooking lush river ravines, organic farm-to-table dining, and morning open-air yoga shalas.',
                'image_url': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
                'standard_rate_per_night': 120.0,
                'is_partner': True,
                'partner_discount_percent': 15.0,
                'jbd_commission_percent': 10.0,
                'amenities': ['Infinity Jungle Pool', 'Daily Yoga Session', 'Organic Breakfast', 'Free Shuttle to Ubud Center', 'Free Wi-Fi'],
                'room_types': [{'name': 'One-Bedroom Valley Villa', 'multiplier': 1.0}, {'name': 'Private Pool Villa', 'multiplier': 1.45}],
                'nearby_attractions': [{'name': 'Tegallalang Terraces', 'distance': '4.5 km'}, {'name': 'Ubud Monkey Forest', 'distance': '3.2 km'}]
            },
            # Rome
            {
                'destination_city': 'Rome',
                'name': 'Grand Hotel de la Minerve Rome (Partner Elite)',
                'stars': 5,
                'address': 'Piazza della Minerva, 69, Rome',
                'description': '17th-century palace situated beside the Pantheon, featuring a rooftop terrace restaurant with jaw-dropping views over Roman domes.',
                'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
                'standard_rate_per_night': 340.0,
                'is_partner': True,
                'partner_discount_percent': 16.0,
                'jbd_commission_percent': 12.0,
                'amenities': ['Pantheon View Rooftop', 'Marble Bathrooms', 'Free Wi-Fi', 'Historic Lounge', 'Butler Service'],
                'room_types': [{'name': 'Classic Renaissance', 'multiplier': 1.0}, {'name': 'Pantheon Deluxe Suite', 'multiplier': 1.7}],
                'nearby_attractions': [{'name': 'Pantheon', 'distance': '0.1 km'}, {'name': 'Piazza Navona', 'distance': '0.3 km'}]
            },
            # Dubai
            {
                'destination_city': 'Dubai',
                'name': 'Atlantis, The Palm Dubai (JBD Exclusive Partner)',
                'stars': 5,
                'address': 'Crescent Rd - The Palm Jumeirah, Dubai',
                'description': 'Iconic oceanfront resort on Palm Jumeirah offering complimentary Aquaventure Waterpark access, underwater suites, and Michelin dining.',
                'image_url': 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600',
                'standard_rate_per_night': 450.0,
                'is_partner': True,
                'partner_discount_percent': 20.0,
                'jbd_commission_percent': 15.0,
                'amenities': ['Unlimited Waterpark Access', 'Private Palm Beach', 'Lost Chambers Aquarium', 'Free Wi-Fi', '23 Fine Restaurants'],
                'room_types': [{'name': 'Ocean King Room', 'multiplier': 1.0}, {'name': 'Underwater Suite', 'multiplier': 3.5}],
                'nearby_attractions': [{'name': 'Aquaventure Waterpark', 'distance': '0.1 km'}, {'name': 'Dubai Marina', 'distance': '8.0 km'}]
            },
            # Cape Town
            {
                'destination_city': 'Cape Town',
                'name': 'The Silo Hotel & Waterfront Suites',
                'stars': 5,
                'address': 'Silo Square, V&A Waterfront, Cape Town',
                'description': 'Architectural masterpiece built in the grain elevator portion of a historic silo complex above Zeitz MOCAA art museum.',
                'image_url': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600',
                'standard_rate_per_night': 390.0,
                'is_partner': True,
                'partner_discount_percent': 15.0,
                'jbd_commission_percent': 12.0,
                'amenities': ['Rooftop Glass Pool', 'Table Mountain Panoramic View', 'Zeitz MOCAA Access', 'Spa', 'Free Wi-Fi'],
                'room_types': [{'name': 'Silo Deluxe Room', 'multiplier': 1.0}, {'name': 'Family Waterfront Suite', 'multiplier': 1.6}],
                'nearby_attractions': [{'name': 'V&A Waterfront', 'distance': '0.2 km'}, {'name': 'Robben Island Ferry', 'distance': '0.5 km'}]
            }
        ]

        for h_data in hotels_data:
            city_name = h_data.pop('destination_city')
            amenities_list = h_data.pop('amenities', [])
            room_types = h_data.pop('room_types', [])
            nearby = h_data.pop('nearby_attractions', [])

            dest = created_destinations.get(city_name)
            hotel = Hotel(
                destination_id=dest.id if dest else None,
                city=city_name,
                country=dest.country if dest else 'Global',
                **h_data
            )
            hotel.set_amenities_list(amenities_list)
            hotel.set_room_types_list(room_types)
            hotel.set_nearby_attractions_list(nearby)
            db.session.add(hotel)

        db.session.commit()

        print("Seeding Flight Offers (Module 4)...")
        flights_seed = [
            # NYC to Tokyo
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'HND', 'destination_city': 'Tokyo',
                'airline_name': 'ANA (All Nippon Airways)', 'flight_number': 'NH-109',
                'departure_time': '11:15', 'arrival_time': '15:20', 'duration_minutes': 845,
                'stops': 0, 'stop_cities': 'Non-stop', 'cabin_class': 'Economy',
                'base_price_usd': 780.0, 'tax_usd': 65.0, 'aircraft_type': 'Boeing 777-300ER'
            },
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'HND', 'destination_city': 'Tokyo',
                'airline_name': 'Japan Airlines', 'flight_number': 'JL-005',
                'departure_time': '13:30', 'arrival_time': '17:40', 'duration_minutes': 850,
                'stops': 0, 'stop_cities': 'Non-stop', 'cabin_class': 'Economy',
                'base_price_usd': 810.0, 'tax_usd': 60.0, 'aircraft_type': 'Airbus A350-1000'
            },
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'HND', 'destination_city': 'Tokyo',
                'airline_name': 'United Airlines', 'flight_number': 'UA-79',
                'departure_time': '07:45', 'arrival_time': '14:50', 'duration_minutes': 965,
                'stops': 1, 'stop_cities': 'San Francisco (SFO)', 'cabin_class': 'Economy',
                'base_price_usd': 620.0, 'tax_usd': 55.0, 'aircraft_type': 'Boeing 787-9'
            },
            # NYC to Paris
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'CDG', 'destination_city': 'Paris',
                'airline_name': 'Air France', 'flight_number': 'AF-023',
                'departure_time': '16:30', 'arrival_time': '06:05', 'duration_minutes': 455,
                'stops': 0, 'stop_cities': 'Non-stop', 'cabin_class': 'Economy',
                'base_price_usd': 540.0, 'tax_usd': 50.0, 'aircraft_type': 'Boeing 777-200'
            },
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'CDG', 'destination_city': 'Paris',
                'airline_name': 'Delta Air Lines', 'flight_number': 'DL-264',
                'departure_time': '19:15', 'arrival_time': '08:55', 'duration_minutes': 460,
                'stops': 0, 'stop_cities': 'Non-stop', 'cabin_class': 'Economy',
                'base_price_usd': 510.0, 'tax_usd': 48.0, 'aircraft_type': 'Airbus A330-900neo'
            },
            # NYC to Bali
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'DPS', 'destination_city': 'Bali',
                'airline_name': 'Singapore Airlines', 'flight_number': 'SQ-025',
                'departure_time': '20:30', 'arrival_time': '09:20', 'duration_minutes': 1250,
                'stops': 1, 'stop_cities': 'Singapore (SIN)', 'cabin_class': 'Economy',
                'base_price_usd': 890.0, 'tax_usd': 70.0, 'aircraft_type': 'Airbus A350-900'
            },
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'DPS', 'destination_city': 'Bali',
                'airline_name': 'Qatar Airways', 'flight_number': 'QR-702',
                'departure_time': '21:00', 'arrival_time': '11:15', 'duration_minutes': 1275,
                'stops': 1, 'stop_cities': 'Doha (DOH)', 'cabin_class': 'Economy',
                'base_price_usd': 840.0, 'tax_usd': 65.0, 'aircraft_type': 'Boeing 777-300ER'
            },
            # NYC to Dubai
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'DXB', 'destination_city': 'Dubai',
                'airline_name': 'Emirates', 'flight_number': 'EK-202',
                'departure_time': '23:00', 'arrival_time': '19:45', 'duration_minutes': 765,
                'stops': 0, 'stop_cities': 'Non-stop', 'cabin_class': 'Economy',
                'base_price_usd': 720.0, 'tax_usd': 60.0, 'aircraft_type': 'Airbus A380-800'
            },
            # NYC to Rome
            {
                'origin_code': 'JFK', 'origin_city': 'New York',
                'destination_code': 'FCO', 'destination_city': 'Rome',
                'airline_name': 'ITA Airways', 'flight_number': 'AZ-609',
                'departure_time': '17:10', 'arrival_time': '07:35', 'duration_minutes': 505,
                'stops': 0, 'stop_cities': 'Non-stop', 'cabin_class': 'Economy',
                'base_price_usd': 580.0, 'tax_usd': 52.0, 'aircraft_type': 'Airbus A330'
            }
        ]

        for f_data in flights_seed:
            flight = FlightOffer(**f_data)
            db.session.add(flight)

        db.session.commit()

        print("Seeding Travel Documentation & Visa Rules (Module 6)...")
        travel_docs_seed = [
            {
                'origin_country': 'United States',
                'destination_country': 'Japan',
                'destination_city': 'Tokyo',
                'visa_requirement_type': 'Visa Free',
                'max_stay_days': 90,
                'passport_validity_months': 6,
                'blank_passport_pages_needed': 2,
                'mandatory_vaccines': 'None required. Routine immunizations advised.',
                'entry_procedures': 'US passport holders can enter Japan visa-free for tourism up to 90 days. Travelers must complete the Visit Japan Web digital QR code customs/immigration form prior to arrival.',
                'official_portal_url': 'https://vjw-lp.digital.go.jp/en/',
                'embassy_info': 'Embassy of Japan in Washington, D.C. / Consulates in NYC, SF, LA, Chicago',
                'estimated_processing_days': 0,
                'estimated_fee_usd': 0.0,
                'required_documents': json.dumps(['Passport valid for duration of stay (6 months recommended)', 'Proof of return ticket', 'Completed Visit Japan Web QR Code'])
            },
            {
                'origin_country': 'United States',
                'destination_country': 'France',
                'destination_city': 'Paris',
                'visa_requirement_type': 'Visa Free (Schengen Zone)',
                'max_stay_days': 90,
                'passport_validity_months': 3,
                'blank_passport_pages_needed': 2,
                'mandatory_vaccines': 'None routinely required.',
                'entry_procedures': 'US citizens can visit France and Schengen zone countries visa-free for up to 90 days within any 180-day window. Starting in 2025/2026, ETIAS travel authorization is required before boarding.',
                'official_portal_url': 'https://france-visas.gouv.fr/',
                'embassy_info': 'French Embassy Washington D.C. & French Consulates',
                'estimated_processing_days': 0,
                'estimated_fee_usd': 8.0,
                'required_documents': json.dumps(['Passport valid 3+ months past planned departure date', 'Proof of sufficient funds (approx. €65/day with hotel reservation)', 'Travel health insurance policy'])
            },
            {
                'origin_country': 'United States',
                'destination_country': 'Indonesia',
                'destination_city': 'Bali',
                'visa_requirement_type': 'e-Visa on Arrival (e-VoA)',
                'max_stay_days': 30,
                'passport_validity_months': 6,
                'blank_passport_pages_needed': 2,
                'mandatory_vaccines': 'Proof of yellow fever only if arriving from an endemic zone.',
                'entry_procedures': 'Travelers can apply online for the 30-day e-VoA (extendable once for 30 days) via the official Indonesian Immigration portal or pay IDR 500,000 (~$35 USD) upon arrival at DPS airport. Bali Tourist Levy (IDR 150,000) also payable online.',
                'official_portal_url': 'https://molina.imigrasi.go.id/',
                'embassy_info': 'Embassy of the Republic of Indonesia in Washington, D.C.',
                'estimated_processing_days': 1,
                'estimated_fee_usd': 35.0,
                'required_documents': json.dumps(['Passport valid for minimum 6 months from arrival', 'Confirmed return flight from Indonesia', 'Payment receipt for Bali Tourism Levy'])
            },
            {
                'origin_country': 'United States',
                'destination_country': 'United Arab Emirates',
                'destination_city': 'Dubai',
                'visa_requirement_type': 'Visa Free on Arrival',
                'max_stay_days': 30,
                'passport_validity_months': 6,
                'blank_passport_pages_needed': 2,
                'mandatory_vaccines': 'No mandatory vaccinations.',
                'entry_procedures': 'US passport holders receive a complimentary 30-day tourist visa stamp upon arrival at Dubai International Airport (DXB). Passport must have at least 6 months remaining validity.',
                'official_portal_url': 'https://u.ae/en/information-and-services/visa-and-emirates-id',
                'embassy_info': 'UAE Embassy Washington D.C.',
                'estimated_processing_days': 0,
                'estimated_fee_usd': 0.0,
                'required_documents': json.dumps(['Valid passport with 6+ months validity', 'Confirmed onward flight', 'Hotel reservation voucher'])
            },
            {
                'origin_country': 'United Kingdom',
                'destination_country': 'Japan',
                'destination_city': 'Tokyo',
                'visa_requirement_type': 'Visa Free',
                'max_stay_days': 90,
                'passport_validity_months': 6,
                'blank_passport_pages_needed': 2,
                'mandatory_vaccines': 'None required.',
                'entry_procedures': 'UK passport holders can enter Japan without a visa for short-term tourism up to 90 days.',
                'official_portal_url': 'https://www.mofa.go.jp/j_info/visit/visa/index.html',
                'embassy_info': 'Embassy of Japan in London',
                'estimated_processing_days': 0,
                'estimated_fee_usd': 0.0,
                'required_documents': json.dumps(['Valid British Citizen Passport', 'Return flight ticket'])
            }
        ]

        for d_rule in travel_docs_seed:
            rule = TravelDocRequirement(**d_rule)
            db.session.add(rule)

        db.session.commit()

        print("Seeding Sample Itineraries and Booking Inquiries...")
        tokyo_dest = created_destinations.get('Tokyo')
        itinerary_tokyo = Itinerary(
            user_id=customer.id,
            title='7-Day Tokyo Cultural Discovery & Gastronomy',
            destination_id=tokyo_dest.id if tokyo_dest else None,
            destination_name='Tokyo, Japan',
            origin_city='New York',
            start_date='2026-12-10',
            duration_days=7,
            travelers_count=2,
            total_budget=4500.0,
            estimated_cost=4240.0,
            travel_style='Cultural & Sightseeing',
            accommodation_tier='Comfort (3-4 Star)',
            cost_breakdown=json.dumps({
                'flights': 1620.0,
                'hotel': 1480.0,
                'activities': 540.0,
                'dining': 400.0,
                'contingency_buffer': 200.0
            }),
            daily_schedule=json.dumps([
                {
                    'day': 1, 'date': 'Dec 10, 2026', 'theme': 'Arrival & Shibuya Skyline',
                    'morning': {'time': '09:00 AM - 12:00 PM', 'title': 'Arrival at HND Airport & Express Train Check-In', 'category': 'Transit', 'cost_usd': 40.0, 'description': 'Take Tokyo Monorail into city center.', 'insider_tip': 'Get Suica transit card.'},
                    'afternoon': {'time': '02:00 PM - 05:00 PM', 'title': 'Shibuya Crossing & Hachiko', 'category': 'Sightseeing', 'cost_usd': 0.0, 'description': 'Witness the world\'s most vibrant intersection.', 'insider_tip': 'Great view from Shibuya Sky.'},
                    'evening': {'time': '06:30 PM - 09:30 PM', 'title': 'Welcome Dinner in Omoide Yokocho', 'category': 'Dining', 'cost_usd': 60.0, 'description': 'Sample artisanal yakitori skewers.', 'insider_tip': 'Cash preferred.'},
                    'day_total_cost': 100.0
                },
                {
                    'day': 2, 'date': 'Dec 11, 2026', 'theme': 'Sacred Heritage & Modern Digital Art',
                    'morning': {'time': '09:00 AM - 12:30 PM', 'title': 'Senso-ji Temple & Asakusa Old Town', 'category': 'Cultural', 'cost_usd': 15.0, 'description': 'Explore Tokyo\'s oldest Buddhist sanctuary.', 'insider_tip': 'Try freshly baked melonpan.'},
                    'afternoon': {'time': '02:00 PM - 05:00 PM', 'title': 'teamLab Planets Digital Art Museum', 'category': 'Sightseeing', 'cost_usd': 56.0, 'description': 'Immersive sensory digital art exhibition.', 'insider_tip': 'Bring smartphone fully charged.'},
                    'evening': {'time': '06:30 PM - 09:30 PM', 'title': 'Tokyo Bay Cruise & Seafood Dinner', 'category': 'Dining', 'cost_usd': 90.0, 'description': 'Delight in fresh sashimi overlooking Rainbow Bridge.', 'insider_tip': 'Window seats face Odaiba.'},
                    'day_total_cost': 161.0
                }
            ]),
            user_notes='Requested high floor room with Tokyo Tower view if possible.',
            status='Inquired',
            is_customized=True
        )
        db.session.add(itinerary_tokyo)
        db.session.flush()

        inquiry_1 = BookingInquiry(
            itinerary_id=itinerary_tokyo.id,
            user_id=customer.id,
            customer_name='Elena Rostova',
            customer_email='customer@jbdtravels.com',
            customer_phone='+1 (555) 987-6543',
            assigned_employee_id=employee.id,
            status='In Review',
            quote_amount=4240.0,
            discount_applied=210.0,
            commission_earned=508.80,
            customer_special_requests='Traveling for anniversary. Please confirm late checkout at hotel.',
            agent_notes='Spoke with hotel concierge. Anniversary welcome amenity and late checkout confirmed.'
        )
        db.session.add(inquiry_1)

        db.session.commit()
        print("Database seeded successfully with all required modules data!")

if __name__ == '__main__':
    seed_database()
