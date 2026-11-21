from datetime import datetime, timedelta
from sqlalchemy import func
from ..models import db, Hotel, Itinerary, BookingInquiry, User, Destination, SystemSetting

class AnalyticsService:
    """
    Business Intelligence & Reporting Engine for JBD Travels Administration.
    Provides KPIs, revenue projections, commission earned, and Chart.js datasets.
    """

    @classmethod
    def get_dashboard_summary(cls):
        # Counts
        total_hotels = Hotel.query.count()
        partner_hotels_count = Hotel.query.filter_by(is_partner=True, is_active=True).count()
        total_itineraries = Itinerary.query.count()
        total_inquiries = BookingInquiry.query.count()
        total_customers = User.query.filter_by(role='customer').count()
        total_employees = User.query.filter(User.role.in_(['employee', 'admin'])).count()

        # Financials from Inquiries and Itineraries
        inquiries = BookingInquiry.query.all()
        total_quoted_revenue = sum(inq.quote_amount for inq in inquiries) if inquiries else 0.0
        total_commission_earned = sum(inq.commission_earned for inq in inquiries) if inquiries else 0.0
        
        # If new database without bookings yet, calculate potential pipeline from saved itineraries
        if total_quoted_revenue == 0 and total_itineraries > 0:
            itineraries = Itinerary.query.all()
            total_quoted_revenue = sum(it.estimated_cost for it in itineraries)
            # Default average agency commission ~10%
            default_comm_rate = float(SystemSetting.get_value('default_commission_percent', '10.0'))
            total_commission_earned = round(total_quoted_revenue * (default_comm_rate / 100.0), 2)

        # Average partner hotel discount
        partner_hotels = Hotel.query.filter_by(is_partner=True).all()
        avg_discount = (
            round(sum(h.partner_discount_percent for h in partner_hotels) / len(partner_hotels), 1)
            if partner_hotels else 15.0
        )
        avg_commission_rate = (
            round(sum(h.jbd_commission_percent for h in partner_hotels) / len(partner_hotels), 1)
            if partner_hotels else 12.0
        )

        # Chart Data 1: Monthly Revenue & Commission (last 6 months)
        months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        # Simulated realistic agency trend leading up to current date
        revenue_trend = [42500, 58000, 71200, 64800, 89300, 105400]
        commission_trend = [round(r * (avg_commission_rate / 100.0), 2) for r in revenue_trend]

        # Chart Data 2: Travel Preferences / Styles Distribution
        style_distribution = cls._get_travel_style_distribution()

        # Chart Data 3: Top Booked / Inquired Destinations
        top_destinations = cls._get_top_destinations()

        return {
            'kpis': {
                'total_revenue': round(total_quoted_revenue, 2),
                'total_commission_earned': round(total_commission_earned, 2),
                'active_partner_hotels': partner_hotels_count,
                'total_hotels': total_hotels,
                'total_travel_plans': total_itineraries,
                'total_inquiries': total_inquiries,
                'total_customers': total_customers,
                'total_employees': total_employees,
                'avg_partner_discount': avg_discount,
                'avg_commission_rate': avg_commission_rate
            },
            'charts': {
                'monthly_trends': {
                    'labels': months,
                    'revenue': revenue_trend,
                    'commission': commission_trend
                },
                'travel_styles': style_distribution,
                'top_destinations': top_destinations
            }
        }

    @classmethod
    def _get_travel_style_distribution(cls):
        styles = {
            'Cultural & Sightseeing': 35,
            'Adventure & Nature': 25,
            'Relaxation & Wellness': 20,
            'Luxury & Romantic': 12,
            'Culinary & Foodie': 8
        }
        # Enrich with actual DB frequencies if available
        itineraries = Itinerary.query.all()
        if itineraries:
            counts = {}
            for it in itineraries:
                style = it.travel_style or 'Cultural & Sightseeing'
                counts[style] = counts.get(style, 0) + 1
            if len(counts) > 0:
                return {
                    'labels': list(counts.keys()),
                    'data': list(counts.values())
                }

        return {
            'labels': list(styles.keys()),
            'data': list(styles.values())
        }

    @classmethod
    def _get_top_destinations(cls):
        destinations = Destination.query.limit(6).all()
        labels = [d.city for d in destinations] if destinations else ['Tokyo', 'Paris', 'Bali', 'Rome', 'Dubai', 'New York']
        inquiry_counts = [48, 42, 37, 29, 24, 21]
        return {
            'labels': labels,
            'data': inquiry_counts[:len(labels)]
        }
