# JBD Travels - REST API Specification

Comprehensive API reference for the JBD Travels backend. Designed for seamless integration, Postman testing, and mobile client connectivity.

Base URL: `http://127.0.0.1:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Registration
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "username": "elena_travels",
    "email": "elena@example.com",
    "password": "Password123!",
    "full_name": "Elena Rostova",
    "role": "customer",
    "nationality": "United States"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful as Customer.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 4,
      "username": "elena_travels",
      "email": "elena@example.com",
      "role": "customer",
      "full_name": "Elena Rostova"
    }
  }
  ```

### 1.2 User Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email_or_username": "customer@jbdtravels.com",
    "password": "Customer123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Welcome back, Elena Rostova!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 3,
      "username": "customer",
      "email": "customer@jbdtravels.com",
      "role": "customer",
      "full_name": "Elena Rostova"
    }
  }
  ```

### 1.3 Current User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object details and permissions.

---

## 2. Destinations & Attractions (`/api/destinations`)

### 2.1 List Destinations
- **Method**: `GET`
- **Path**: `/api/destinations`
- **Query Parameters**:
  - `search` (string): Search query for city, country, or destination name
  - `continent` (string): Filter by continent (e.g. `Asia`, `Europe`, `North America`)
  - `tag` (string): Filter by feature tag (e.g. `culture`, `adventure`)
  - `featured` (bool): `true` for highlighted destinations
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 12,
    "destinations": [
      {
        "id": 1,
        "name": "Tokyo, Japan",
        "city": "Tokyo",
        "country": "Japan",
        "continent": "Asia",
        "airport_code": "HND",
        "avg_cost_per_day_mid": 195.0,
        "safety_rating": 4.9,
        "tags": ["culture", "sightseeing", "foodie", "shopping"]
      }
    ]
  }
  ```

### 2.2 Destination Details with Attractions
- **Method**: `GET`
- **Path**: `/api/destinations/<id>`
- **Response**: Destination profile with all associated tourist attractions, category tags, ticket prices, and travel tips.

---

## 3. AI Recommendations & Itinerary Generator (`/api/recommendations`)

### 3.1 AI Destination Matcher (Scikit-Learn Cosine Similarity)
- **Method**: `POST`
- **Path**: `/api/recommendations/destinations`
- **Request Body**:
  ```json
  {
    "preferences": ["culture", "foodie", "sightseeing"],
    "budget": 3000,
    "duration_days": 5,
    "travelers_count": 2,
    "limit": 4
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "ai_engine": "JBD TravelGenie Hybrid Recommendation Model",
    "recommendations": [
      {
        "destination": { "name": "Tokyo, Japan", "city": "Tokyo" },
        "match_percentage": 96,
        "matched_tags": ["culture", "foodie", "sightseeing"],
        "why_recommended": "Based on your interest in culture, foodie, Tokyo offers world-class highlights. Well within budget.",
        "top_attractions": [...]
      }
    ]
  }
  ```

### 3.2 AI Budget Itinerary Generator
- **Method**: `POST`
- **Path**: `/api/recommendations/itinerary`
- **Request Body**:
  ```json
  {
    "destination": "Paris, France",
    "budget": 2800,
    "duration_days": 5,
    "travelers_count": 2,
    "travel_style": "Cultural & Sightseeing",
    "accommodation_tier": "Comfort (3-4 Star)",
    "origin_city": "New York"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "plan": {
      "title": "5-Day Cultural & Sightseeing Journey in Paris",
      "destination_city": "Paris",
      "total_budget": 2800.0,
      "estimated_cost": 2640.0,
      "budget_variance": 160.0,
      "feasibility_status": "Optimal (Within Budget)",
      "cost_breakdown": {
        "flights": 980.0,
        "hotel": 896.0,
        "activities": 384.0,
        "dining": 336.0,
        "contingency_buffer": 140.0
      },
      "daily_schedule": [...]
    }
  }
  ```

---

## 4. Flight & Hotel Price Comparison (`/api/flights`, `/api/hotels`)

### 4.1 Search Flights
- **Method**: `GET`
- **Path**: `/api/flights/search`
- **Query Parameters**: `origin`, `destination`, `cabin_class`, `stops`, `sort_by`
- **Notice**: Returns explicit `is_simulated: true` flag and data source attribution.

### 4.2 Search & Compare Hotels
- **Method**: `GET`
- **Path**: `/api/hotels`
- **Query Parameters**: `destination`, `stars`, `max_price`, `partner_only`, `sort_by`
- **Response**: Includes `price_comparison` object comparing standard direct price, Expedia, Booking.com, and exclusive JBD Partner rate.

---

## 5. Travel Documentation (`/api/travel-docs`)

### 5.1 Check Entry & Visa Requirements
- **Method**: `GET`
- **Path**: `/api/travel-docs/check?origin=United+States&destination=Japan`
- **Response**:
  ```json
  {
    "success": true,
    "advisory": {
      "origin_country": "United States",
      "destination_country": "Japan",
      "visa_requirement_type": "Visa Free",
      "max_stay_days": 90,
      "passport_validity_months": 6,
      "official_portal_url": "https://vjw-lp.digital.go.jp/en/",
      "required_documents": [...]
    }
  }
  ```

---

## 6. Administrative Dashboard & Hotel CRUD (`/api/admin`)

*Requires role: `employee` or `admin` with valid JWT Bearer token.*

### 6.1 Executive Dashboard Metrics
- **Method**: `GET`
- **Path**: `/api/admin/dashboard`
- **Response**: High-level KPIs and Chart.js datasets for monthly revenue and preference distribution.

### 6.2 Add Partner Hotel (Admin Only)
- **Method**: `POST`
- **Path**: `/api/admin/hotels`
- **Request Body**: Hotel details, standard rate, discount %, and commission %.

### 6.3 Update Partner Hotel Rates & Discounts (Admin Only)
- **Method**: `PUT`
- **Path**: `/api/admin/hotels/<id>`

### 6.4 Delete Partner Hotel (Admin Only)
- **Method**: `DELETE`
- **Path**: `/api/admin/hotels/<id>`

### 6.5 Update Booking Inquiry Status (Employee or Admin)
- **Method**: `PUT`
- **Path**: `/api/admin/inquiries/<id>`
- **Request Body**:
  ```json
  {
    "status": "Confirmed",
    "agent_notes": "Flight ticket and luxury hotel suite confirmed."
  }
  ```
