# Aurum & Co. — Jewellery AI Customer Journey Orchestrator

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v4.21-lightgrey.svg)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.2-blue.svg)](https://www.postgresql.org)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-orange.svg)](https://ai.google.dev)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> An enterprise-grade customer intelligence and journey orchestration platform engineered for high-value jewellery retail operations. Unifies customer touchpoints across bespoke CAD designing, bullion & gemstone sourcing, master atelier crafting, assay hallmarking, armored vault transit, private VIP salon viewings, GIA certification, post-sale repairs, and lifetime exchange upgrades.

---

## 1. Executive Summary & Business Problem

In luxury jewellery retail, high-net-worth patrons interact with diverse specialized departments:
- **Sales Advisors** in VIP boutique salons
- **Master Artisans & Goldsmiths** in the crafting atelier
- **Inventory & Vault Controllers** managing armored logistics
- **Service & Concierge Specialists** handling repairs and ultrasonic cleaning
- **Marketing Directors** organizing bespoke gala previews and anniversary outreach.

Without a central platform, customer context becomes fragmented across department silos. This leads to disjointed communication, compliance breaches (contacting opted-out patrons), missed sales opportunities, and customer frustration over delayed repairs.

The **Jewellery AI Customer Journey Orchestrator** solves this by:
1. **Unifying the 360° Customer Profile**: Centralizing purchase history, preferences, ring sizes, spouse anniversaries, GIA certificates, and service tickets.
2. **Orchestrating the 10-Stage Lifecycle**: Tracking journey milestones from *Design* to *Exchange*.
3. **AI-Powered Decisioning**: Generating real-time intent classification, sentiment analysis, conversation summaries, draft concierge responses, and Next Best Actions using Google Gemini AI.
4. **Deterministic Consent & Frequency Governance**: Enforcing a 7-layer business rule engine before any outreach can occur.
5. **Human-in-the-Loop (HITL) Controls**: Enforcing an approval and override gate where AI recommendations require human verification, recording immutable audit logs with mandatory override reasons.
6. **Role-Based Access Control (RBAC)**: Providing tailored operational views for Admins, Sales Managers, Marketing Managers, Service Agents, and Customers.

---

## 2. The 10-Stage Unified Jewellery Journey

```text
[1. Design] ──> [2. Sourcing] ──> [3. Production] ──> [4. Hallmarking] ──> [5. Inventory Transfer]
                                                                                  │
[10. Exchange] <── [9. Repair] <── [8. Certification] <── [7. Sale] <── [6. Consultation]
```

1. **Design**: Bespoke CAD drafting, metal selection (18K/22K Gold, 950 Platinum), 3D render sign-off.
2. **Sourcing**: Ethically sourced Antwerp diamonds, Colombian emeralds, fine bullion.
3. **Production**: Master artisan handcrafting, casting, and micro-pavé prong setting.
4. **Hallmarking**: Government BIS assay office purity certification and laser inscription.
5. **Inventory Transfer**: Armored transit from Central Vault to flagship boutique.
6. **Customer Consultation**: Private VIP salon viewing, champagne trial, and bespoke adjustments.
7. **Sale**: High-ticket point-of-sale invoice settlement.
8. **Certification**: Issuance of official GIA, IGI, or SGL gemological certificates.
9. **Repair**: Complimentary ultrasonic cleaning, resizing, and prong tightening in the atelier.
10. **Exchange**: Valuation appraisal, buy-back upgrade calculation, and lifetime exchange credit.

---

## 3. The Core System Flow

```text
Customer
   ↓
Unified Profile
   ↓
Journey
   ↓
Interactions
   ↓
Consent & Preferences
   ↓
AI Analysis (Gemini Intent, Sentiment, Churn)
   ↓
Next Best Action
   ↓
Deterministic Governance Rules (Consent, Frequency Cap, Eligibility)
   ↓
Human Approval (Approve / Reject / Override with Reason)
   ↓
Action Executed
   ↓
Customer Outcome
   ↓
Model Feedback Loop
```

---

## 4. Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, PostgreSQL (Dual standard pool + embedded PGlite support), JWT, bcryptjs, Zod, Helmet, Morgan.
- **AI Integration**: Google Gemini API (`@google/generative-ai`) on backend only with resilient heuristic fallbacks.
- **Database**: 38 Relational PostgreSQL tables with UUIDs, foreign keys, constraints, composite indexes, and immutable audit logs.

---

## 5. Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18+ (tested on v20 and v24)
- **npm**: v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/jewellery-ai-customer-journey-orchestrator.git
cd jewellery-ai-customer-journey-orchestrator

# Install dependencies across root, backend, and frontend
npm run install:all
```

### 2. Configure Environment Variables
Copy `backend/.env.example` to `backend/.env`:
```bash
PORT=5000
DATABASE_URL=embedded
JWT_SECRET=aurum_jewellery_super_secret_jwt_key_2026_nxtwave
GEMINI_API_KEY=your_gemini_api_key_here
AI_CONFIDENCE_THRESHOLD=0.75
```
> **Note on Zero-Config Database**: If `DATABASE_URL=embedded` or omitted, the application automatically runs on embedded PostgreSQL 16 (via `@electric-sql/pglite`) without requiring a separate PostgreSQL daemon setup. To connect to an external PostgreSQL instance (e.g. Supabase, Neon, AWS RDS), set `DATABASE_URL=postgresql://user:password@localhost:5432/jewellery_orchestrator`.

### 3. Initialize & Seed PostgreSQL Database
```bash
npm run seed
```

### 4. Start the Application
In separate terminal tabs:
```bash
# Start Backend API Server (Port 5000)
npm run backend

# Start Frontend React Client (Port 3000)
npm run frontend
```
Open **http://localhost:3000** in your browser.

---

## 6. Demo Accounts & Credentials

For fast evaluation, the login page features 1-click quick-login buttons for each role:

| Persona | Role | Email | Password | Primary Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Aarav Singhal** | `admin` | `admin@aurumjewellery.com` | `password123` | Full admin console, RBAC, settings, audit logs & overrides |
| **Kavita Deshmukh** | `sales_manager` | `sales.manager@aurumjewellery.com` | `password123` | VIP journeys, high-ticket approvals, and sales pipeline |
| **Rohan Verma** | `marketing_manager` | `marketing@aurumjewellery.com` | `password123` | Audience segments, campaigns, consent governance |
| **Neha Kapoor** | `service_agent` | `service@aurumjewellery.com` | `password123` | Service tickets, AI concierge drafts, repair coordination |
| **Rahul Sharma** | `customer` | `rahul.sharma@example.com` | `password123` | Client portal view for 360 profile, journeys, and certificates |

---

## 7. Project Structure

```text
jewellery-ai-customer-journey-orchestrator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIRecommendationCard/
│   │   │   ├── AppShell/
│   │   │   ├── CustomerCard/
│   │   │   ├── Header/
│   │   │   ├── JourneyTimeline/
│   │   │   ├── NotificationPanel/
│   │   │   ├── OverrideReasonModal/
│   │   │   ├── Sidebar/
│   │   │   └── StatusBadge/
│   │   ├── context/ (AuthContext, NotificationContext, ToastContext)
│   │   ├── pages/
│   │   │   ├── AIInsightsPage/
│   │   │   ├── AnalyticsPage/
│   │   │   ├── AuditLogsPage/
│   │   │   ├── ConsentGovernancePage/
│   │   │   ├── CustomerDetailPage/
│   │   │   ├── CustomersListPage/
│   │   │   ├── JourneyTimelinePage/
│   │   │   ├── LoginPage/
│   │   │   ├── ModelOutcomesPage/
│   │   │   ├── NotificationsPage/
│   │   │   ├── OverviewPage/
│   │   │   ├── SegmentsPage/
│   │   │   ├── ServiceTicketsPage/
│   │   │   ├── SettingsPage/
│   │   │   └── UsersPage/
│   │   ├── routes/ (AppRoutes, ProtectedRoute)
│   │   ├── services/ (api, customerService, journeyService, aiService, etc.)
│   │   ├── constants/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── ai/ (geminiClient, promptTemplates, fallbackEngine, aiEngine)
│   │   ├── config/ (db, env, constants)
│   │   ├── controllers/ (authController, customerController, journeyController, ticketController, aiController, etc.)
│   │   ├── middleware/ (auth, rbac, validation, audit, errorHandler)
│   │   ├── services/ (journeyService, recommendationService, ruleEngine, customerService, ticketService, analyticsService, etc.)
│   │   ├── validators/ (Zod schemas)
│   │   ├── utils/ (jwt, password, logger, response)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── seeds/
│   │   └── 001_jewellery_retail_seed.sql
│   ├── schema.sql
│   ├── db-runner.js
│   └── README.md
│
├── docs/
│   ├── IMPLEMENTATION_PLAN.md
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── .gitignore
├── README.md
└── package.json
```

---

## 8. Security & Governance Standards

- **Backend-Only Secrets**: `GEMINI_API_KEY` and `DATABASE_URL` reside solely in backend `.env`.
- **Bcrypt Password Hashing**: Passwords stored with 10 salt rounds.
- **JWT Authentication**: Signed with 24-hour expiration and verified on every protected route.
- **Server-Side RBAC**: Role and permission enforcement cannot be bypassed by modifying frontend state.
- **Append-Only Audit Logs**: Every login, mutation, AI execution, approval, and override is permanently saved to `audit_logs`.
- **Mandatory Override Rationale**: Overriding AI recommendations requires a minimum 5-character reason stored with reviewer identity.

---

## 9. License

This project is licensed under the ISC License. Designed and engineered for the NxtWave Software Developer Assessment.
