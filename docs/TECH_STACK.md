# Technology Stack Specification & Selection Rationale

This document outlines the architectural and engineering rationale for the technology stack implemented in the **JBD Travels AI-Assisted Travel Planning and Management System**.

---

## 1. Stack Matrix & Alignment with Recommendations

| Component | Internship Recommended | Implemented Technology | Selection Justification |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | **React 18 + Tailwind CSS** | Delivers a high-performance, component-based Single Page Application (SPA) with declarative state management, modern responsive layouts, and zero-build instant browser evaluation via Babel standalone. |
| **Backend** | Python Flask / Spring Boot / Node.js | **Python 3 Flask** | Lightweight microframework with native Python library interoperability, clean RESTful blueprint modularity, and rapid algorithmic execution. |
| **Database** | MySQL / PostgreSQL | **Relational SQLite + SQLAlchemy ORM** | Zero-configuration relational database engine adhering to ACID standards, perfectly suited for standalone prototypes, portable across any OS, and effortlessly scalable to PostgreSQL via SQLAlchemy. |
| **AI Integration** | Python-based recommendation logic or AI API | **Scikit-Learn & NumPy Cosine Similarity Vector Matching Engine** | Implements robust content-based filtering using multi-dimensional preference vectorization, cosine angle metrics, and budget feasibility constraints. |
| **Data Visualisation** | Chart.js / Recharts | **Chart.js 4 (UMD)** | Industry-standard canvas charting library delivering interactive multi-dataset bar charts and doughnut charts on the administrative dashboard. |
| **Security & Auth** | Role-based permissions | **PyJWT + Werkzeug Security** | Cryptographically salted PBKDF2 password hashing with JSON Web Token (JWT) stateless session verification and role-based decorators (`@token_required`, `@roles_required`). |
| **API Testing** | Postman | **Unittest Test Suite + Postman Spec** | Comprehensive automated Python test suite covering unit, functional, integration, and security tests. |
| **Development Environment** | VS Code | **VS Code / Command Shell** | Modern IDE and shell tooling. |
| **Version Control** | Git and GitHub | **Git** | Standard Git version control structure. |

---

## 2. Deep Dive: Component Rationale

### 2.1 Backend Architecture: Flask & RESTful API
- **Modular Blueprints**: The backend is partitioned into discrete blueprints (`auth`, `destinations`, `recommendations`, `flights`, `hotels`, `travel_docs`, `itineraries`, `admin`). This ensures loose coupling and high cohesion.
- **SQLAlchemy ORM**: Abstracted relational persistence ensures models can run on SQLite for local testing or seamlessly transition to PostgreSQL/MySQL in production by simply changing `DATABASE_URL`.
- **CORS Support**: Integrated with `flask-cors` to allow seamless cross-origin communication between web clients and backend endpoints.

### 2.2 Machine Learning & AI Integration
- **Scikit-Learn Vectorization**: Rather than arbitrary static conditionals, destination tags and user desires are represented as numerical feature vectors in a 12-dimensional interest space (Adventure, Relaxation, Culture, Nature, Sightseeing, Foodie, Luxury, Nightlife, Heritage, Beaches, Shopping, Romantic).
- **Cosine Similarity Function**: Computes normalized dot product between user vector and destination matrix, yielding mathematically sound matching scores.
- **Budget Penalty/Reward Functions**: Mathematical scaling ensures users with tight budgets are guided toward accessible locations, while premium budgets receive luxury destination pairings.

### 2.3 Simulated vs Live API Handling (Mandatory Requirement)
- External Global Distribution Systems (GDS) such as Amadeus and Sabre typically require paid commercial subscriptions and live credentials.
- The JBD Travels prototype integrates a high-fidelity **Simulated GDS Distribution Engine** for flight fares and an **OTA Comparative Engine** for hotel prices.
- As required by the specification, **simulated data is explicitly distinguished from live information** with visual UI badges and dedicated API metadata fields (`is_simulated: true`, data source notices).
