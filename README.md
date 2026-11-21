# JBD Travels - AI-Assisted Travel Planning and Management System

A full-stack, enterprise-grade web application prototype designed and developed for **JBD Travels**. The platform simplifies global travel planning by allowing users to explore world destinations, receive personalized AI recommendations, dynamically generate budget-constrained day-by-day itineraries, compare flight and hotel pricing across providers, and consult destination entry/visa rules. Additionally, it features an executive administrative dashboard for managing partner hotels, negotiated rates, commission earnings, and customer travel bookings.

---

## 🌟 Key Highlights & Module Coverage

| Module | Features & Capabilities | Spec Compliance |
| :--- | :--- | :---: |
| **Module 1: User Interface & Authentication** | Responsive modern UI with Tailwind CSS; user registration and login with secure password hashing & JWT; role-based access control for **Customer**, **Employee**, and **Administrator**; 1-click demo switcher. | ✅ Complete |
| **Module 2: Budget-Based Travel Planning** | Dynamic sliders for total budget ($500 - $15,000) and duration (1 - 21 days); travel style selection; algorithmic budget allocation into flights (35%), hotel (32%), activities (16%), dining (12%), and contingency (5%); budget feasibility analysis. | ✅ Complete |
| **Module 3: AI-Assisted Recommendations** | Scikit-learn cosine similarity preference matcher; multi-attribute interest vectorization; match percentage scoring (e.g. 96% Match); natural language reasoning; sequenced day-by-day itineraries (Morning/Afternoon/Evening). | ✅ Complete |
| **Module 4: Flight & Hotel Price Comparison** | Multi-carrier flight search with Cheapest/Fastest/Best Value badges; clearly labeled simulated data engine; cross-provider hotel comparison (Direct Hotel Rate vs Booking.com vs Expedia vs **JBD Partner Club Rate** with savings indicator). | ✅ Complete |
| **Module 5: Hotel Information Management** | Comprehensive catalog with amenities, room types, high-resolution imagery, standard rates, negotiated partner discounts, and nearby tourist attractions with walking/driving distances. | ✅ Complete |
| **Module 6: Travel Documentation** | Destination-specific passport validity requirements (6-month rule), visa type evaluation (Visa-Free, eVisa, VoA, Consular), mandatory health guidelines, and direct official immigration portal links. | ✅ Complete |
| **Module 7: Administrative Dashboard** | Executive KPIs (Booked Revenue, Agency Commission, Active Partner Hotels); interactive **Chart.js** revenue trends and travel style distribution; partner hotel CRUD; booking management; commission & discount configurator. | ✅ Complete |

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: [React 18](https://react.dev/) Single Page Application with JSX, Tailwind CSS, FontAwesome 6, and [Chart.js 4](https://www.chartjs.org/) for executive data visualization.
- **Backend**: [Python 3 Flask](https://flask.palletsprojects.com/) RESTful Web Service architecture with blueprint modularity and CORS support.
- **Database**: Relational [SQLite](https://www.sqlite.org/) with [SQLAlchemy ORM](https://www.sqlalchemy.org/) and automated database seeding.
- **AI Recommendation Engine**: Python [scikit-learn](https://scikit-learn.org/) & [NumPy](https://numpy.org/) cosine similarity vector matching combined with budget feasibility weighting.
- **Security**: PBKDF2 password hashing via `Werkzeug`, JWT token authentication with role-based decorators (`@token_required`, `@roles_required`).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Web browser (Chrome, Firefox, Edge, Safari)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Initialize & Seed Database
```bash
python seeds/seed_data.py
```
*Seeds 12+ world destinations, 20+ tourist attractions, 9+ partner hotels, 10+ flight routes, and sample customer inquiries.*

### 4. Start the Application Server
```bash
python run.py
```
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login)

The application includes pre-configured demo credentials accessible via the UI **Quick Demo** buttons:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@jbdtravels.com` | `Admin123!` | Full control: Hotel CRUD, commissions, revenue metrics, global policies. |
| **Employee / Agent** | `agent@jbdtravels.com` | `Agent123!` | Customer itinerary management, booking inquiries, quotes. |
| **Customer** | `customer@jbdtravels.com` | `Customer123!` | AI travel planning, budget optimization, price comparison, saving trips. |

---

## 🧪 Automated Test Suite

Run the full automated test suite (100% passing):
```bash
python -m unittest discover tests
```

Individual test modules:
```bash
python -m unittest tests/test_auth.py             # Auth & RBAC access control
python -m unittest tests/test_budget_planner.py   # Budget allocation mathematics
python -m unittest tests/test_recommender.py      # AI cosine similarity matching
python -m unittest tests/test_price_comparison.py # Flight & hotel price comparison
python -m unittest tests/test_travel_docs.py      # Visa & passport rules engine
python -m unittest tests/test_admin.py            # Admin CRUD & analytics
python -m unittest tests/test_endpoints.py        # End-to-end integration smoke tests
```

---

## 📁 Repository Structure

```
├── app/
│   ├── __init__.py            # Flask app factory, blueprint registration & CORS
│   ├── config.py              # Environment configurations (Dev, Test, Prod)
│   ├── models/                # SQLAlchemy models (User, Hotel, Flight, Destination, etc.)
│   ├── routes/                # REST API blueprints (Auth, Planner, Compare, Admin, etc.)
│   ├── services/              # AI recommendation, budget allocator, pricing engines
│   ├── static/                # Frontend assets (React app.js, custom.css, api.js)
│   └── templates/
│       └── index.html         # HTML5 shell loading React, Tailwind, Chart.js
├── seeds/
│   └── seed_data.py           # Comprehensive seed script for demo data
├── tests/                     # Automated unit and integration test suite
├── docs/                      # Technical documentation
│   ├── SYSTEM_ARCHITECTURE.md # Architecture, ER diagram & AI algorithm design
│   ├── API_DOCUMENTATION.md   # Postman-compatible REST API specification
│   ├── TECH_STACK.md          # Technical stack selection & justification
│   └── USER_MANUAL.md         # Role-based user guide
├── run.py                     # Server entry point
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```
