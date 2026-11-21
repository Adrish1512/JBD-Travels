# System Architecture & Technical Design Document

**Project**: AI-Assisted Travel Planning and Management System for JBD Travels  
**Target Organization**: JBD Travels Global Concierge  
**Version**: 2.0.0  

---

## 1. High-Level Architectural Overview

The JBD Travels system is designed around a decoupled, service-oriented web architecture consisting of a responsive React.js Single Page Application (SPA) client communicating with a Python Flask RESTful API service backed by a relational SQLite database.

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client (React 18 SPA)"]
        UI["Tailwind CSS + FontAwesome Responsive UI"]
        Modules["UI Modules (Explore, Planner, Compare, Docs, Admin)"]
        Charts["Chart.js Analytics Visualization Engine"]
        APIClient["Standardized JS API Client (Fetch + JWT Auth)"]
    end

    subgraph APILayer["Backend RESTful API (Python Flask 3.1)"]
        AuthBP["Auth & RBAC Service (/api/auth)"]
        DestBP["Destination & Attraction Service (/api/destinations)"]
        AIRecBP["AI Recommendation Engine (/api/recommendations)"]
        PriceBP["Flight & Hotel Comparison Engine (/api/flights, /api/hotels)"]
        DocsBP["Immigration & Visa Advisory Engine (/api/travel-docs)"]
        AdminBP["Administrative & Governance Service (/api/admin)"]
    end

    subgraph ServiceLayer["Business Logic & Computational Engines"]
        CosineEng["Scikit-Learn Cosine Similarity Preference Matcher"]
        BudgetEng["Dynamic Expense Allocator & Feasibility Assessor"]
        PricingEng["Multi-Source OTA Comparative Pricing Engine"]
        ImmigrationEng["Passport Validity & Entry Rules Processor"]
    end

    subgraph DataLayer["Persistence Layer (SQLite + SQLAlchemy ORM)"]
        DB[(jbd_travels.db)]
    end

    UI --> Modules
    Modules --> Charts
    Modules --> APIClient
    APIClient -->|HTTPS REST / JSON| APILayer

    AuthBP --> ServiceLayer
    DestBP --> ServiceLayer
    AIRecBP --> CosineEng
    AIRecBP --> BudgetEng
    PriceBP --> PricingEng
    DocsBP --> ImmigrationEng
    AdminBP --> ServiceLayer

    ServiceLayer --> DataLayer
```

---

## 2. Database Entity-Relationship (ER) Model

```mermaid
erDiagram
    USER ||--o{ ITINERARY : creates
    USER ||--o{ BOOKING_INQUIRY : submits
    USER ||--o{ BOOKING_INQUIRY : assigned_to
    DESTINATION ||--o{ TOURIST_ATTRACTION : contains
    DESTINATION ||--o{ HOTEL : features
    DESTINATION ||--o{ ITINERARY : destination_of
    ITINERARY ||--o{ BOOKING_INQUIRY : generates

    USER {
        int id PK
        string username UK
        string email UK
        string password_hash
        string role "customer | employee | admin"
        string full_name
        string nationality
        string preferred_currency
        datetime created_at
    }

    DESTINATION {
        int id PK
        string name UK
        string city
        string country
        string continent
        string airport_code
        float avg_cost_per_day_budget
        float avg_cost_per_day_mid
        float avg_cost_per_day_luxury
        text tags "JSON array"
        float safety_rating
        string best_time_to_visit
    }

    TOURIST_ATTRACTION {
        int id PK
        int destination_id FK
        string name
        string category
        float estimated_duration_hours
        float ticket_price_usd
        float rating
        text tips
    }

    HOTEL {
        int id PK
        int destination_id FK
        string name
        int stars
        float standard_rate_per_night
        boolean is_partner
        float partner_discount_percent
        float jbd_commission_percent
        text amenities "JSON array"
        text room_types "JSON array"
        text nearby_attractions "JSON array"
    }

    FLIGHT_OFFER {
        int id PK
        string origin_code
        string origin_city
        string destination_code
        string destination_city
        string airline_name
        string flight_number
        int duration_minutes
        int stops
        string cabin_class
        float base_price_usd
        float tax_usd
        boolean is_simulated
    }

    ITINERARY {
        int id PK
        int user_id FK
        string title
        int destination_id FK
        int duration_days
        int travelers_count
        float total_budget
        float estimated_cost
        string travel_style
        string accommodation_tier
        text cost_breakdown "JSON"
        text daily_schedule "JSON"
        string status "Draft | Saved | Inquired | Confirmed"
    }

    BOOKING_INQUIRY {
        int id PK
        int itinerary_id FK
        int user_id FK
        int assigned_employee_id FK
        string customer_name
        string customer_email
        float quote_amount
        float discount_applied
        float commission_earned
        string status "Pending | In Review | Confirmed | Cancelled"
        text agent_notes
    }

    TRAVEL_DOC_REQUIREMENT {
        int id PK
        string origin_country
        string destination_country
        string visa_requirement_type
        int max_stay_days
        int passport_validity_months
        string official_portal_url
        text required_documents "JSON"
    }

    SYSTEM_SETTING {
        int id PK
        string key UK
        text value
        string description
    }
```

---

## 3. Computational Algorithms & Mathematical Formulas

### 3.1 AI Preference Matching (Cosine Similarity)
The AI recommender transforms user desires and destination profiles into multi-dimensional feature vectors $\vec{u}$ and $\vec{d}$ across feature keys (Adventure, Relaxation, Culture, Nature, Sightseeing, Foodie, Luxury, Nightlife, Beaches, Shopping):

$$\text{Cosine Similarity}(\vec{u}, \vec{d}) = \frac{\vec{u} \cdot \vec{d}}{\|\vec{u}\|_2 \|\vec{d}\|_2} = \frac{\sum_{i=1}^{n} u_i d_i}{\sqrt{\sum_{i=1}^{n} u_i^2} \sqrt{\sum_{i=1}^{n} d_i^2}}$$

### 3.2 Budget Feasibility Scoring
To prevent proposing unaffordable destinations, the system computes daily budget per traveler:

$$B_{\text{daily}} = \frac{\text{Total Budget}}{D \times T}$$

Where $D$ is journey duration in days and $T$ is the number of travelers. The budget compatibility factor $S_{\text{budget}}$ is calculated:

$$S_{\text{budget}} = \begin{cases} 
1.0 & \text{if } B_{\text{daily}} \ge C_{\text{mid}} \\
0.85 & \text{if } C_{\text{budget}} \le B_{\text{daily}} < C_{\text{mid}} \\
\max\left(0.40, \frac{B_{\text{daily}}}{C_{\text{budget}}}\right) & \text{if } B_{\text{daily}} < C_{\text{budget}}
\end{cases}$$

The overall hybrid match score combines preference alignment, budget feasibility, and safety rating:

$$\text{Final Match Score} = (0.60 \times \text{Similarity}) + (0.30 \times S_{\text{budget}}) + \left(0.10 \times \frac{\text{Safety}}{5.0}\right)$$

### 3.3 Budget Allocation Strategy (Module 2)
The budget allocation engine assigns financial resources into five clear categories:

| Category | Allocation Ratio | Purpose |
| :--- | :---: | :--- |
| **Flights / Long-Distance Transit** | $35\%$ | Roundtrip airfare, baggage, and airport transfer |
| **Hotels & Accommodations** | $32\%$ | Partner hotel room rate per night $\times$ duration |
| **Activities & Sightseeing** | $16\%$ | Entrance admissions, museum passes, and guided tours |
| **Dining & Culinary** | $12\%$ | Daily meals, local specialties, and refreshment |
| **Contingency Buffer** | $5\%$ | Safety cushion for incidentals and currency fluctuations |

$$\text{Estimated Total} = C_{\text{flight}} + C_{\text{hotel}} + C_{\text{activities}} + C_{\text{dining}} + C_{\text{buffer}}$$

$$\text{Variance} = \text{Target Budget} - \text{Estimated Total}$$

### 3.4 Partner Pricing, Discount & Commission Mathematics
For partner hotels:
- **JBD Exclusive Partner Rate**:
  $$P_{\text{partner}} = P_{\text{standard}} \times \left(1 - \frac{D_{\text{partner}}}{100}\right)$$
- **Customer Savings**:
  $$\text{Savings} = P_{\text{standard}} - P_{\text{partner}}$$
- **JBD Agency Commission**:
  $$\text{Commission} = P_{\text{partner}} \times \left(\frac{C_{\text{agency}}}{100}\right)$$

---

## 4. Role-Based Access Control (RBAC) Matrix

| Resource / Action | Customer | Employee (Agent) | Administrator |
| :--- | :---: | :---: | :---: |
| Browse Destinations & Attractions | ✅ | ✅ | ✅ |
| Run AI Recommendation Engine | ✅ | ✅ | ✅ |
| Generate & Save Budget Itineraries | ✅ | ✅ | ✅ |
| Compare Flights & Hotel Prices | ✅ | ✅ | ✅ |
| Check Visa & Passport Requirements | ✅ | ✅ | ✅ |
| Submit Booking Inquiries | ✅ | ✅ | ✅ |
| View All Customer Itineraries | ❌ | ✅ | ✅ |
| Update Inquiry Status & Assign Agent | ❌ | ✅ | ✅ |
| Add / Edit / Delete Partner Hotels | ❌ | ❌ | ✅ |
| Modify Hotel Negotiated Rates & Discounts | ❌ | ❌ | ✅ |
| Configure Global Commission Rates | ❌ | ❌ | ✅ |
| Access Financial KPIs & Chart.js Metrics | ❌ | ✅ | ✅ |
