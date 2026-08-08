# JEWELLERY AI CUSTOMER JOURNEY ORCHESTRATOR
## Comprehensive Technical Architecture Document

---

## 1. System Topology & Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (React 18)                          │
│   Tailwind CSS / Luxury Gold Aesthetic │ Recharts │ React Router v6 │ Axios  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / REST JSON
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER (Express.js)                        │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌───────────────────────┐ │
│ │  Security & RBAC     │ │  Controllers & APIs  │ │  Business Services    │ │
│ │  - JWT Auth Guard    │ │  - /api/v1/auth      │ │  - JourneyService     │ │
│ │  - Role/Perm Checker │ │  - /api/v1/customers │ │  - ConsentEngine      │ │
│ │  - Rate Limiting     │ │  - /api/v1/journeys  │ │  - RuleEngine         │ │
│ │  - Zod Request Valid │ │  - /api/v1/tickets   │ │  - RecommendationSvc  │ │
│ └──────────────────────┘ └──────────────────────┘ └───────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                      AI TIER (Google Gemini API Backend)                │ │
│ │ - Intent Classifier │ Sentiment Analyzer │ Churn / Propensity Heuristic │ │
│ │ - Conversation Summarizer │ Next Best Action (NBA) Generator            │ │
│ │ - Evidence-Based Outputs & Low Confidence Safeguards                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ SQL / Parameterized Queries
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (PostgreSQL Relational DB)                  │
│ - Dual Support: Standard PostgreSQL (pg pool) / Embedded PostgreSQL (PGlite)│
│ - 38 Relational Entities with UUIDs, Foreign Keys, Indexes & Audit Logs     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 10-Stage Unified Jewellery Journey

The jewellery customer lifecycle connects all touchpoints into one seamless profile:
1. **Design**: Bespoke CAD drafting, metal selection (18K/22K Gold, 950 Platinum), gemstone preferences.
2. **Sourcing**: Ethically sourced diamonds, natural Muzo emeralds, bullion sourcing.
3. **Production**: Master artisan handcrafting, micro-pavé prong setting in the atelier.
4. **Hallmarking**: Government BIS assay office laser inscription, purity stamp verification.
5. **Inventory Transfer**: Armored vault transit to designated flagship boutique.
6. **Customer Consultation**: Private VIP salon viewing, champagne trial.
7. **Sale**: High-ticket point-of-sale invoice settlement.
8. **Certification**: Issuance of GIA/IGI gemological certificates.
9. **Repair**: Complimentary ultrasonic cleaning, resizing, and prong tightening.
10. **Exchange**: Lifetime upgrade & trade-in valuation.

---

## 3. Human-in-the-Loop (HITL) Governance & Rule Engine

```
[ AI Engine Generates NBA ]
            │
            ▼
[ Deterministic 7-Layer Rule Check ]
  1. Regulatory Consent (Opt-In vs Opt-Out)
  2. Preferred Channel Matching
  3. Rolling 7-Day Frequency Cap Check
  4. Active Conflicting Journey Stage Check
  5. Urgent Ticket Conflict Filter
  6. Staff RBAC Permission Verification
            │
      Passed? ──No──> [ Automatically Blocked / Marked Ineligible ]
            │
           Yes
            │
            ▼
[ Held in Pending Review Queue ]
            │
            ├───> [ Staff Approves ] ───> [ Dispatched to Customer ] ───> [ Audit Log + Outcome Track ]
            │
            ├───> [ Staff Rejects ] ────> [ Feedback Recorded ] ────────> [ Model Tuning Logged ]
            │
            └───> [ Staff Overrides ] ──> [ Mandatory Reason Modal ] ───> [ Custom Action Executed ]
                                                                                  │
                                                                                  ▼
                                                                    [ Immutable Audit Trail ]
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| Resource | Admin | Sales Manager | Marketing Manager | Service Agent | Customer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Customers** | Full (CRUD) | Read / Update | Read Only | Read / Update | Self Profile Only |
| **Journeys** | Full (CRUD) | Full (Update) | Read Only | Update Milestones | Self Journey Only |
| **Service Tickets**| Full | Read / Assign | Read Only | Full (CRUD + Draft)| Self Tickets Only |
| **AI Insights** | Full | Read / Run | Read / Run | Read / Run | None |
| **Approvals** | Full | Approve / Override | Approve / Reject | Submit Review | None |
| **Segments** | Full | Read Only | Full (Create) | None | None |
| **Audit Logs** | Read Only (Immutable) | Read Only | Read Only | None | None |
| **Settings** | Full (Configure) | Read Only | Read Only | None | None |
