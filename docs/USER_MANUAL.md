# JBD Travels - User & Administrator Manual

This comprehensive guide walks users, travel agents, and system administrators through all capabilities of the **JBD Travels AI-Assisted Travel Planning and Management System**.

---

## 1. Getting Started & Logging In

When you open `http://127.0.0.1:5000`:
1. The top navigation bar displays the **JBD Travels** logo, primary feature tabs, and the **Role Switcher**.
2. To test different permission levels without typing passwords, use the **⚡ Quick Demo Accounts (1-Click)** buttons in the Sign In modal or the **Role Switcher** in the top navigation:
   - **Customer**: Elena Rostova (`customer@jbdtravels.com` / `Customer123!`)
   - **Employee / Agent**: Marcus Vance (`agent@jbdtravels.com` / `Agent123!`)
   - **Administrator**: Sarah Jenkins (`admin@jbdtravels.com` / `Admin123!`)

---

## 2. Customer Workflow (Traveler)

### 2.1 Explore & AI Recommendation (Module 3)
1. Navigate to **Explore & AI** in the navbar.
2. Select your travel interests (e.g. *Cultural & Heritage*, *Sightseeing*, *Culinary & Foodie*).
3. Adjust the **Total Budget** and **Duration** sliders.
4. Click **Find Matches for Me**.
5. The recommendation engine evaluates global destinations using scikit-learn cosine similarity and displays ranked matches with an exact match percentage (e.g., *96% Match*) and natural-language AI reasoning.
6. Click **Build Travel Plan** on any recommended city to carry your parameters directly into the budget planner.

### 2.2 Budget-Based Travel Planning (Module 2)
1. Navigate to **Budget Planner**.
2. Enter your desired **Destination**, **Departure City**, **Total Budget (USD)**, **Duration (Days)**, **Number of Travelers**, and **Travel Style**.
3. Click **Generate Budget Itinerary**.
4. The system calculates:
   - **Feasibility Status**: Indicates whether the plan is within budget, with surplus savings, or requires a budget stretch.
   - **Itemized Expenses**: Clear financial breakdown for Flights (35%), Partner Hotel (32%), Activities (16%), Dining (12%), and Contingency Buffer (5%).
   - **Day-by-Day Schedule**: A sequenced morning, afternoon, and evening plan complete with estimated admissions, duration, and insider tips.
5. Click **Save Plan** to store the itinerary in your account, or click **Book with JBD Agent** to submit an official reservation inquiry.

### 2.3 Flight & Hotel Price Comparison (Module 4 & 5)
1. Navigate to **Price Compare**.
2. **Compare Flights**:
   - Filter by Origin, Destination, Cabin Class, and Stops.
   - View multi-carrier offers with *Cheapest Option*, *Fastest Route*, and *Best Value* badges.
   - View clear notification of the JBD Simulated GDS Engine.
3. **Compare Hotels**:
   - Filter by destination or star rating.
   - Review comparative rates: Direct Hotel Price vs Expedia vs Booking.com vs **JBD Partner Club Rate**.
   - Notice the green savings badge displaying your exact discount.

### 2.4 Visa & Passport Documentation (Module 6)
1. Navigate to **Visa & Docs**.
2. Select your passport citizenship (e.g., *United States*) and destination country (e.g., *Japan*).
3. The system generates an instant official advisory including:
   - Visa requirement category (*Visa Free*, *eVisa*, *VoA*, or *Consular Visa*)
   - Maximum permitted stay duration
   - Minimum remaining passport validity (e.g., 6 months rule)
   - Blank passport pages needed
   - Required document checklist
   - Direct link to the verified government/embassy immigration portal

---

## 3. Employee / Travel Agent Workflow

### 3.1 Managing Customer Bookings & Inquiries
1. Log in or switch role to **Agent (Marcus Vance)**.
2. Click **Admin Dashboard** in the top navigation.
3. Click **Bookings & Plans**:
   - Review all customer inquiries submitted from AI-generated itineraries.
   - View customer name, email, trip destination, and total quote amount.
   - Update inquiry status from *Pending* to *In Review*, *Confirmed*, or *Cancelled*.
   - Input agent notes regarding room upgrades, flight confirmations, or dietary requests.

---

## 4. Administrator Workflow

### 4.1 Partner Hotel CRUD Operations (Module 5 & 7)
1. Log in or switch role to **Admin (Sarah Jenkins)**.
2. Click **Admin Dashboard** in the top navigation.
3. Select **Partner Hotels**:
   - View standard public rates, negotiated partner discounts, and JBD commission percentages.
   - **Add Hotel**: Click *Add Partner Hotel* to create a new property with stars, nightly rate, discount %, and commission %.
   - **Edit Pricing**: Click the pencil icon on any hotel row to update prices or renegotiate commission margins.
   - **Delete Hotel**: Click the trash can icon to remove a hotel from the network.

### 4.2 Executive Analytics & Visualizations
1. Under **Admin Dashboard**, select **Executive KPIs**:
   - Review Gross Booked Volume, JBD Commission Earned, Active Partner Hotels, and Travel Plan Volume.
   - Inspect the **Chart.js** Monthly Revenue & Commission Bar Chart.
   - Inspect the **Chart.js** Customer Travel Preferences Doughnut Chart.

### 4.3 Agency Pricing & Policy Configuration
1. Select **Pricing Rules**:
   - Adjust default agency commission percentage (e.g., 12.0%).
   - Adjust default partner hotel discount margin (e.g., 15.0%).
   - Update agency customer support phone hotline and concierge email.
