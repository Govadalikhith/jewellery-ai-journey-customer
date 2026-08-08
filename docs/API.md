# REST API Documentation — Jewellery AI Customer Journey Orchestrator

Base URL: `/api/v1`

All authenticated endpoints require the `Authorization: Bearer <token>` HTTP header.

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@aurumjewellery.com",
    "password": "password123",
    "rememberMe": true
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "user_admin_01",
        "email": "admin@aurumjewellery.com",
        "firstName": "Aarav",
        "lastName": "Singhal",
        "role": "admin",
        "roleDisplayName": "System Administrator",
        "storeName": "Mumbai Flagship Boutique & Atelier"
      }
    }
  }
  ```

### `GET /api/v1/auth/me`
Returns current authenticated user session details.

---

## 2. Customer 360 Profiles (`/api/v1/customers`)

### `GET /api/v1/customers`
- **Query Params**: `search`, `tier`, `status`, `limit`, `offset`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cust_rahul_sharma",
        "first_name": "Rahul",
        "last_name": "Sharma",
        "email": "rahul.sharma@example.com",
        "phone": "+91 98200 99881",
        "tier": "VIP",
        "total_spend": 1850000,
        "churn_risk_score": 0.78,
        "status": "at_risk"
      }
    ],
    "meta": { "total": 6, "limit": 50, "offset": 0 }
  }
  ```

### `GET /api/v1/customers/:id`
Returns full 360° unified profile including:
- Customer core attributes & tier
- Preferences (metal, ring size, gemstone, anniversary)
- Regulatory Consents per channel
- Active 10-stage journey with milestone progression
- Omnichannel interactions timeline
- Purchase sales invoices
- Gemological certificates (GIA/IGI)
- Repairs in atelier
- Lifetime exchanges
- Open service tickets
- AI insights: Churn probability, Propensity score, Recent NBA recommendations.

---

## 3. Journey Lifecycles (`/api/v1/journeys`)

### `GET /api/v1/journeys`
Lists all active journeys with stage labels.

### `PATCH /api/v1/journeys/:id/stage`
- **Body**:
  ```json
  {
    "stage": "hallmarking",
    "status": "completed",
    "notes": "BIS laser assay completed on 950 Pt crown setting."
  }
  ```

---

## 4. AI Intelligence Hub (`/api/v1/ai`)

### `POST /api/v1/ai/analyze-interaction`
- **Body**:
  ```json
  { "text": "I dropped off my engagement ring ten days ago and received no update. Where is my ring?" }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "intent": {
        "intent": "repair_status_inquiry",
        "confidence": 0.94,
        "explanation": "Customer inquiring about overdue repair timeline."
      },
      "sentiment": {
        "sentiment": "frustrated",
        "score": 0.15,
        "confidence": 0.91
      }
    }
  }
  ```

---

## 5. Recommendations & Human Governance (`/api/v1/recommendations`)

### `POST /api/v1/recommendations/evaluate`
Generates Next Best Action and validates deterministic governance rules (Consent, Frequency Cap, Conflicting Tickets).

### `POST /api/v1/recommendations/:id/approve`
Approves recommendation, dispatches message, updates frequency counter, and records approval in audit log.

### `POST /api/v1/recommendations/:id/override`
Requires a mandatory reason (minimum 5 characters) to override AI.
- **Body**:
  ```json
  {
    "decision": "overridden",
    "override_reason": "Director discretionary loyalty allowance for VIP patron with ₹50L+ spend.",
    "final_action_taken": "Personal telephonic update from Salon Director."
  }
  ```

---

## 6. Audit Logs (`/api/v1/audit-logs`)
Returns immutable, append-only logs of all authentication, mutation, AI execution, and override events.
