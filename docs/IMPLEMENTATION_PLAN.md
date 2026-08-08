# JEWELLERY AI CUSTOMER JOURNEY ORCHESTRATOR
## Comprehensive Implementation Plan & Technical Architecture Document

---

## 1. Project Overview & Executive Summary

The **Jewellery AI Customer Journey Orchestrator** is an enterprise-grade customer intelligence and journey management platform designed specifically for high-value jewellery retail operations. In luxury jewellery retail, high-net-worth and discerning clients interact across multi-touchpoint lifecycles spanning custom bespoke design, gemstone sourcing, artisan workshop crafting, official assay hallmarking, vault and boutique transfers, private concierge consultations, high-ticket sales, gemological certification (GIA/IGI), post-purchase repairs, and lifetime exchanges.

Without a unified intelligence platform, customer context becomes fragmented across department silos (sales advisors, master artisans, inventory controllers, customer service agents, and marketing executives). This fragmentation leads to disjointed communication, missed sales opportunities, compliance breaches (contacting opted-out customers), and suboptimal service delivery.

The Jewellery AI Customer Journey Orchestrator resolves this by:
1. **Unifying the 360° Customer Profile**: Aggregating identities, purchase histories, bespoke designs, certifications, and service tickets into a single timeline.
2. **Orchestrating the End-to-End Lifecycle**: Tracking and transitioning customers across all 10 standard jewellery stages from *Design* to *Exchange*.
3. **AI-Powered Decisioning with Human-in-the-Loop Governance**: Generating real-time intent classification, sentiment analysis, churn probability, engagement propensity, conversation summaries, draft responses, and Next Best Actions (NBA) using Google Gemini AI, governed strictly by deterministic consent, channel preference, frequency capping, and eligibility rules.
4. **Mandatory Human-in-the-Loop (HITL) Controls**: Enforcing an approval/override gate where AI recommendations require human verification before execution, recording immutable audit trails for every decision.
5. **Role-Based Access Control (RBAC)**: Providing tailored operational views for Admins, Sales Managers, Marketing Managers, Service Agents, and Customers.

---

## 2. Business Workflow & Journey Lifecycle

### 2.1 The 10-Stage Unified Jewellery Journey Lifecycle
```
[1. Design] ──> [2. Sourcing] ──> [3. Production] ──> [4. Hallmarking] ──> [5. Inventory Transfer]
                                                                                  │
[10. Exchange] <── [9. Repair] <── [8. Certification] <── [7. Sale] <── [6. Consultation]
```

1. **Design**: Bespoke CAD drafting, metal selection (18K/22K Gold, Platinum), gemstone preferences, 3D rendering sign-off with customer.
2. **Sourcing**: Ethically sourced diamonds, natural sapphires/emeralds, bullion sourcing, and gemological laboratory pre-checks.
3. **Production**: Master artisan handcrafting, casting, prong setting, micro-pavé detailing, and quality assurance in the atelier.
4. **Hallmarking**: Government assay office laser inscription, purity verification (BIS/916, 750, 950 Pt), and official stamp certification.
5. **Inventory Transfer**: Armored transit from central vault/workshop to designated flagship boutique with dual-custody verification.
6. **Customer Consultation**: Private VIP salon viewing, physical fitment trial, champagne consultation, and bespoke adjustments.
7. **Sale**: High-ticket point-of-sale transaction, luxury packaging, invoice generation, tax compliance, and payment settlement.
8. **Certification**: Issuance of digital and physical gemological certificates (GIA, IGI, SGL) and insurance appraisal documentation.
9. **Repair**: Ultrasonic cleaning, prong tightening, rhodium replating, resizing, gemstone replacement, and restoration tracking.
10. **Exchange**: Valuation appraisal, buy-back upgrade calculation, exchange credit application for lifetime upgrades.

---

## 3. Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER (React 18 + Vite)                      │
│   Tailwind CSS / Luxury Gold Aesthetic │ React Router v6 │ Recharts │ Axios │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / REST API / JSON
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION TIER (Node.js + Express)                    │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌───────────────────────┐ │
│ │  Security & Auth     │ │  Controllers & APIs  │ │  Business Services    │ │
│ │  - JWT Auth Guard    │ │  - /api/v1/auth      │ │  - JourneyService     │ │
│ │  - RBAC Middleware   │ │  - /api/v1/customers │ │  - ConsentEngine      │ │
│ │  - Rate Limiting     │ │  - /api/v1/journeys  │ │  - RuleEngine         │ │
│ │  - Helmet / CORS     │ │  - /api/v1/tickets   │ │  - RecommendationSvc  │ │
│ │  - Zod Request Valid │ │  - /api/v1/ai        │ │  - AuditService       │ │
│ └──────────────────────┘ └──────────────────────┘ └───────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                      AI TIER (Google Gemini API Backend)                │ │
│ │ - Intent Classifier │ Sentiment Analyzer │ Churn / Propensity Model     │ │
│ │ - Conversation Summarizer │ Next Best Action (NBA) Generator            │ │
│ │ - Response Drafter with Strict Evidence-Based Output (No Hallucination) │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ SQL / Parametric Queries
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA TIER (PostgreSQL Relational DB)                   │
│ - Dual Support: Standard PostgreSQL (pg pool) / Embedded PostgreSQL (PGlite)│
│ - Relational Integrity, UUIDs, Foreign Keys, JSONB, Constraints & Indexes   │
│ - Tables: Users, Roles, Customers, Journeys, Interactions, Consents,        │
│   Recommendations, Approvals, Service Tickets, Audits, Notifications, etc. │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Architecture

### 4.1 Framework & Libraries
- **Core**: React 18 with Vite for lightning-fast HMR and optimized builds.
- **Routing**: React Router v6 with authenticated route wrappers, role guards, and dynamic breadcrumbs.
- **Styling**: Vanilla CSS + Tailwind CSS modern luxury jewellery design system (Warm neutral `#FAF8F5`, Charcoal `#1A1A1A`, Champagne Gold `#D4AF37`, Rose Gold `#B76E79`, Emerald `#2D5A27`, Muted borders `#E5E0D8`).
- **Icons**: Lucide React for consistent, crisp iconography.
- **Charts**: Recharts for interactive analytics, journey stage funnels, conversion rates, and churn distributions.
- **State & Context**: Dedicated React Contexts for `AuthContext`, `NotificationContext`, `CustomerContext`, and `ToastContext`.

### 4.2 Application Shell & Layout
- Reusable `AppShell` with collapsible Sidebar, Top Header with Global Search, Live Notifications Bell with Unread Badge, Quick User Role Switcher (for seamless assessment demonstration), and breadcrumb navigation.
- Dedicated modal systems for Override Reasons, Action Confirmations, AI Sandbox tester, and Ticket Creation.

---

## 5. Backend Architecture

### 5.1 Architecture Principles
- **Layered Clean Architecture**:
  - `controllers/`: Handles HTTP request/response parsing, parameter extraction, and status codes.
  - `middleware/`: Authentication (`verifyToken`), RBAC authorization (`requireRole`, `requirePermission`), request validation (`validateBody`), audit logging, and error handling.
  - `services/`: Encapsulates pure business logic, database transactions, governance rules, and AI orchestration.
  - `repositories/`: Direct database query interface utilizing parameterized SQL to prevent SQL injection.
  - `ai/`: Gemini API integration with structured prompt templates, Zod schema validation of AI outputs, fallback heuristics, and model traceability.
  - `validators/`: Zod schemas for all inbound POST/PUT requests.
  - `utils/`: JWT generation, password hashing (`bcryptjs`), response formatters, and seed loaders.

---

## 6. PostgreSQL Database Architecture

### 6.1 Design Standards
- **Primary Keys**: UUID v4 (`uuid_generate_v4()` / Node crypto UUIDs) for distributed uniqueness.
- **Timestamps**: `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`, `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`.
- **Soft Deletion**: `is_active BOOLEAN DEFAULT TRUE`, `deleted_at TIMESTAMP WITH TIME ZONE NULL`.
- **Indexes**: Composite and B-Tree indexes on `customer_id`, `status`, `stage`, `user_id`, `created_at`, `email`.
- **Database Engine Support**: Supports standard PostgreSQL connection strings via `DATABASE_URL` AND embedded PostgreSQL (PGlite) out of the box for immediate zero-config execution.

---

## 7. Database Entities and Relational Schema

### 7.1 Core Schema Entities

1. **`users`**: id, email, password_hash, first_name, last_name, role_id, phone, avatar_url, is_active, last_login_at, created_at, updated_at.
2. **`roles`**: id, name (`admin`, `sales_manager`, `marketing_manager`, `service_agent`, `customer`), description, created_at.
3. **`permissions`**: id, role_id, resource, action (`create`, `read`, `update`, `delete`, `approve`, `override`, `export`, `configure`).
4. **`customers`**: id, first_name, last_name, email, phone, tier (`VIP`, `Platinum`, `Gold`, `Silver`), total_spend, lifetime_value, preferred_store_id, assigned_advisor_id, churn_risk_score, propensity_score, status, created_at, updated_at.
5. **`customer_preferences`**: id, customer_id, preferred_metal, ring_size, favorite_gemstone, anniversary_date, spouse_name, preferred_channel (`email`, `whatsapp`, `phone`, `sms`, `in_person`), contact_time_preference, created_at, updated_at.
6. **`consents`**: id, customer_id, channel (`email`, `whatsapp`, `phone`, `sms`, `marketing_push`), is_consented, consent_date, opt_out_date, consent_source, created_at, updated_at.
7. **`journeys`**: id, customer_id, title, current_stage (`design`, `sourcing`, `production`, `hallmarking`, `inventory_transfer`, `consultation`, `sale`, `certification`, `repair`, `exchange`), status (`in_progress`, `completed`, `on_hold`, `cancelled`), target_completion_date, total_estimated_value, assigned_staff_id, created_at, updated_at.
8. **`journey_stages`**: id, journey_id, stage_name, status (`pending`, `in_progress`, `completed`, `skipped`), started_at, completed_at, owner_id, notes, metadata (JSONB), created_at.
9. **`interactions`**: id, customer_id, journey_id, channel, direction (`inbound`, `outbound`), subject, summary, raw_content, sentiment (`positive`, `neutral`, `negative`), sentiment_score, intent, staff_id, timestamp, created_at.
10. **`designs`**: id, customer_id, journey_id, title, metal_type, metal_purity, gemstone_details, estimated_weight_grams, cad_file_url, status, created_at.
11. **`production_records`**: id, journey_id, design_id, artisan_id, workshop_name, casting_date, setting_date, qc_status, notes, created_at.
12. **`hallmark_records`**: id, journey_id, assay_office, certificate_number, purity_verified, laser_inscribed_text, certified_date, created_at.
13. **`inventory`**: id, sku, name, category, metal_type, purity, center_stone_carat, price, stock_quantity, store_location_id, status, created_at.
14. **`inventory_transfers`**: id, journey_id, inventory_id, source_location, destination_location, transit_status, dispatched_at, received_at, verified_by_id, created_at.
15. **`sales`**: id, customer_id, journey_id, invoice_number, total_amount, tax_amount, discount_amount, payment_method, store_id, sales_advisor_id, sale_date, created_at.
16. **`certificates`**: id, customer_id, sale_id, certificate_authority (`GIA`, `IGI`, `SGL`, `In-House`), certificate_number, diamond_cut, color, clarity, carat_weight, pdf_url, issued_date, created_at.
17. **`repairs`**: id, customer_id, item_description, issue_type (`resizing`, `prong_tightening`, `cleaning_polishing`, `gemstone_resetting`, `rhodium_plating`), status (`received`, `in_atelier`, `ready_for_pickup`, `delivered`), estimated_cost, actual_cost, promised_date, delivered_date, created_at.
18. **`exchanges`**: id, customer_id, original_item_description, original_value, trade_in_allowance, upgraded_item_id, balance_payable, appraisal_notes, status, created_at.
19. **`service_tickets`**: id, customer_id, ticket_number, subject, priority (`low`, `medium`, `high`, `urgent`), status (`open`, `in_progress`, `pending_approval`, `resolved`, `closed`), assigned_agent_id, category, churn_indicator, sentiment, created_at, updated_at.
20. **`conversations`**: id, ticket_id, customer_id, channel, created_at.
21. **`messages`**: id, conversation_id, sender_type (`customer`, `agent`, `system`, `ai`), sender_id, message_text, is_ai_draft, is_approved, timestamp, created_at.
22. **`segments`**: id, name, description, criteria (JSONB), customer_count, created_by, created_at, updated_at.
23. **`campaigns`**: id, name, segment_id, channel, status (`draft`, `active`, `paused`, `completed`), scheduled_date, total_targeted, created_at.
24. **`recommendations`**: id, customer_id, journey_id, ticket_id, recommendation_type, recommended_action, channel, confidence_score, explanation, evidence (JSONB), model_version, status (`pending_review`, `approved`, `rejected`, `overridden`, `completed`), consent_verified, eligibility_verified, frequency_verified, created_at, updated_at.
25. **`approvals`**: id, recommendation_id, reviewer_id, decision (`approved`, `rejected`, `overridden`), override_reason, previous_recommendation, final_action_taken, reviewed_at, created_at.
26. **`outcomes`**: id, recommendation_id, approval_id, customer_response (`accepted`, `declined`, `converted`, `no_response`, `unsubscribed`), conversion_value, feedback_score (`helpful`, `not_helpful`, `incorrect`, `correct`), feedback_notes, measured_at, created_at.
27. **`notifications`**: id, user_id, title, message, notification_type (`ticket_assigned`, `ai_approval_needed`, `journey_update`, `overdue_alert`, `system`), is_read, urgency (`normal`, `urgent`), link_url, created_at.
28. **`model_versions`**: id, model_name, version_tag, provider (`Google Gemini`), prompt_template, is_active, deployed_at.
29. **`ai_runs`**: id, model_version_id, input_snapshot (JSONB), output_payload (JSONB), latency_ms, tokens_used, confidence, status, created_at.
30. **`audit_logs`**: id, actor_id, actor_name, actor_role, action (`LOGIN`, `DATA_ACCESS`, `CREATE`, `UPDATE`, `DELETE`, `AI_EXECUTION`, `APPROVE_RECOMMENDATION`, `REJECT_RECOMMENDATION`, `OVERRIDE_RECOMMENDATION`, `EXPORT_DATA`, `SYSTEM_SETTING_CHANGE`), entity_type, entity_id, previous_value (JSONB), new_value (JSONB), reason, ip_address, created_at.
31. **`configuration`**: id, config_key, config_value (JSONB), description, updated_by_id, updated_at.

---

## 8. API Architecture & Versioning

All API endpoints follow RESTful conventions under `/api/v1/`:
- **Auth**: `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`, `POST /api/v1/auth/forgot-password`
- **Users**: `GET /api/v1/users`, `POST /api/v1/users`, `PUT /api/v1/users/:id`, `PATCH /api/v1/users/:id/status`, `GET /api/v1/users/roles`
- **Customers**: `GET /api/v1/customers` (paginated, filtered), `GET /api/v1/customers/:id` (full 360 profile), `POST /api/v1/customers`, `PUT /api/v1/customers/:id`, `GET /api/v1/customers/:id/timeline`, `GET /api/v1/customers/:id/ai-insights`
- **Journeys**: `GET /api/v1/journeys`, `GET /api/v1/journeys/:id`, `POST /api/v1/journeys`, `PATCH /api/v1/journeys/:id/stage`, `GET /api/v1/journeys/stages/summary`
- **Service Tickets**: `GET /api/v1/tickets`, `GET /api/v1/tickets/:id`, `POST /api/v1/tickets`, `PATCH /api/v1/tickets/:id/status`, `POST /api/v1/tickets/:id/messages`, `POST /api/v1/tickets/:id/ai-draft`
- **AI Intelligence**: `POST /api/v1/ai/analyze-interaction`, `POST /api/v1/ai/predict-nba`, `POST /api/v1/ai/draft-response`, `POST /api/v1/ai/summarize-conversation`, `GET /api/v1/ai/runs`
- **Recommendations & Governance**: `GET /api/v1/recommendations`, `POST /api/v1/recommendations/evaluate`, `POST /api/v1/recommendations/:id/approve`, `POST /api/v1/recommendations/:id/reject`, `POST /api/v1/recommendations/:id/override`
- **Consents**: `GET /api/v1/consents/:customerId`, `PUT /api/v1/consents/:customerId`
- **Segments & Outreach**: `GET /api/v1/segments`, `POST /api/v1/segments`, `GET /api/v1/campaigns`, `POST /api/v1/campaigns`
- **Outcomes & Model Feedback**: `GET /api/v1/outcomes`, `POST /api/v1/outcomes/feedback`
- **Notifications**: `GET /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read`, `POST /api/v1/notifications/mark-all-read`, `DELETE /api/v1/notifications/:id`
- **Analytics**: `GET /api/v1/analytics/dashboard`, `GET /api/v1/analytics/journey-funnel`, `GET /api/v1/analytics/ai-accuracy`, `GET /api/v1/analytics/export`
- **Audit Logs**: `GET /api/v1/audit-logs` (filtered by actor, date, action, entity)
- **Settings**: `GET /api/v1/settings`, `PUT /api/v1/settings`

### Standard Response Envelope
**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format or missing required fields",
    "details": [ ... ]
  }
}
```

---

## 9. Authentication & RBAC Design

### 9.1 Authentication Flow
1. User submits Email + Password.
2. Server validates with Zod, queries `users` table with bcrypt hash comparison.
3. Upon match, signs JWT with payload `{ id, email, role, firstName, lastName }` (expires in 24h).
4. Generates an immutable `audit_logs` record for `LOGIN`.
5. Frontend stores JWT in localStorage and attaches `Authorization: Bearer <token>` in Axios interceptor.

### 9.2 Role-Based Access Matrix

| Role | Customers | Journeys | Tickets | AI Insights | Approvals & Overrides | Segments/Campaigns | User Mgmt | Audit Logs | Settings |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Full | Full | Full | Full | Full | Full | Full | Full | Full |
| **Sales Manager** | Read/Edit | Full | Read/Assign | Read/Execute | Approve/Override | Read | Read Only | Read Only | Read Only |
| **Marketing Manager** | Read Only | Read Only | Read Only | Read/Execute | Approve/Reject | Full | None | Read Only | Read Only |
| **Service Agent** | Read/Edit | Read/Update | Full | Read/Execute | Submit/Review | None | None | None | None |
| **Customer** | Self Only | Self Only | Self Only | None | None | None | None | None | None |

---

## 10. AI Architecture & Gemini Integration

### 10.1 Key Capabilities
1. **Intent Classification**: Identifies customer inquiries (e.g., `repair_status_inquiry`, `bespoke_design_consultation`, `pricing_inquiry`, `hallmark_verification`, `exchange_upgrade`).
2. **Sentiment Analysis**: Evaluates tone (`positive`, `neutral`, `negative`, `frustrated`) with confidence scores.
3. **Churn Probability & Propensity**: Assessment ML heuristics with dynamic risk factors (overdue repairs, negative sentiment, long dormancy).
4. **Conversation Summarization**: Concise executive summaries of long multi-turn interactions.
5. **Channel-Appropriate Response Drafting**: VIP concierge luxury tone for WhatsApp, Email, or In-Store notes.
6. **Next Best Action (NBA)**: Synthesizes customer journey stage, past tickets, preferences, and pending milestones into ranked, actionable steps with transparent evidence bullets.

### 10.2 AI Traceability & Safety Guardrails
- **Backend-Only Keys**: `GEMINI_API_KEY` is never sent to the client.
- **Evidence-Based Output**: AI responses must return structured JSON including `result`, `confidence`, `explanation`, `evidence` bullets, `modelVersion`, and `timestamp`.
- **Low Confidence Thresholding**: If confidence < configurable threshold (e.g. 75%), status is flagged as `LOW_CONFIDENCE_HUMAN_REVIEW_REQUIRED`.

---

## 11. Consent, Eligibility, & Business Rules Engine

Before any AI outreach or campaign recommendation can be approved:
1. **Consent Verification**: Check `consents` table for the customer and channel. If `is_consented = FALSE`, block recommendation with reason `CONSENT_OPT_OUT`.
2. **Preferred Channel Matching**: Validate channel against `customer_preferences.preferred_channel`.
3. **Frequency Capping**: Check messages sent within rolling 7-day window. If limit exceeded (e.g., > 2 messages/week), block with `FREQUENCY_CAP_EXCEEDED`.
4. **Journey Eligibility**: Check if customer is currently in a conflicting stage (e.g., do not send promotional sales outreach while an unresolved High-Severity Repair is active).
5. **Staff Permission**: Ensure the acting staff member has `approve` permission for the resource.

---

## 12. Human-in-the-Loop (HITL) Workflow

```
[ AI Engine Generates NBA ]
            │
            ▼
[ Deterministic Consent & Frequency Check ]
            │
      Passed? ──No──> [ Automatically Blocked / Marked Ineligible ]
            │
           Yes
            │
            ▼
[ Placed in Pending Review Queue ]
            │
            ├───> [ Agent Approves ] ───> [ Dispatched / Executed ] ───> [ Audit Log + Outcome Track ]
            │
            ├───> [ Agent Rejects ] ────> [ Logged with Feedback ] ────> [ AI Model Feedback Recorded ]
            │
            └───> [ Agent Overrides ] ──> [ Mandatory Reason Modal ] ──> [ Overridden Action Executed ]
                                                                                │
                                                                                ▼
                                                                  [ Immutable Audit + AI Evaluation ]
```

---

## 13. Audit Logging & Notification Architecture

### 13.1 Audit Log Pipeline
Every material action is appended to `audit_logs`:
- User Logins / Logouts
- Customer Data Views & Edits
- AI Run Executions
- Recommendation Approvals, Rejections, and Overrides
- Ticket Status Changes & Escalations
- System Settings Modifications
- CSV Data Exports

### 13.2 Notification Center
- **Triggers**: New ticket assignment, overdue repair alert, AI recommendation requiring urgent review, customer high churn flag, system warning.
- **Features**: Mark as read, mark all read, filter unread/urgent, direct navigation link to entity.

---

## 14. Page-by-Page Implementation Plan

| Page | Route | Description & Key Components |
| :--- | :--- | :--- |
| **1. Login** | `/login` | Email/password login, remember me, forgot password modal, validation, demo quick-login buttons for 5 roles. |
| **2. Customer Profile** | `/customers/:id` | 360° profile, journey overview, interaction timeline, purchases, repairs, certificates, AI insights, churn/propensity gauge, NBA. |
| **3. Customers List** | `/customers` | Filterable, searchable table with tier badges, churn indicators, quick view drawer, and new customer modal. |
| **4. Journey Timeline** | `/journeys` & `/journeys/:id` | 10-stage visual stepper, stage owners, timestamps, linked designs/hallmarks/transfers/repairs, status filters. |
| **5. Segments & Outreach**| `/segments` | Visual segment builder, campaign launcher, frequency cap settings, channel rules, and outreach queue. |
| **6. Service Tickets** | `/tickets` & `/tickets/:id` | Agent assist console, conversation view, AI draft generator, sentiment badge, escalation, approve/reject/override controls. |
| **7. AI Predictions** | `/ai-insights` | AI Intelligence Hub, live intent classification, sentiment analysis, churn prediction, interactive AI sandbox tester. |
| **8. Consent Governance** | `/consent-governance` | Rule verification matrix, consent status by customer, frequency tracker, AI suggestion vs Approved action separation. |
| **9. Model Outcomes** | `/model-outcomes` | AI accuracy dashboard, acceptance rates, override reason distribution, helpful/unhelpful feedback stats. |
| **10. Analytics & Reports**| `/analytics` | Executive KPIs, revenue, active journeys, stage conversion funnel, churn risk distribution, Recharts graphs, CSV export. |
| **11. Notifications** | `/notifications` | Full notifications center, filter by urgency/status, batch mark as read, direct jump to records. |
| **12. User Management** | `/users` | Admin user directory, role assignment, permission inspector, activate/deactivate, last login tracking. |
| **13. Audit Logs & Settings**| `/audit-logs` & `/settings` | Immutable audit log viewer with multi-field search and export; system settings for AI thresholds and frequency limits. |

---

## 15. Folder Structure

```
jewellery-ai-customer-journey-orchestrator/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AIRecommendationCard/
│   │   │   ├── AppShell/
│   │   │   ├── CustomerCard/
│   │   │   ├── Header/
│   │   │   ├── JourneyTimeline/
│   │   │   ├── Modal/
│   │   │   ├── NotificationPanel/
│   │   │   ├── Sidebar/
│   │   │   └── UI/ (Button, Badge, Card, Input, Select, Skeleton, Table, Tabs)
│   │   ├── context/ (AuthContext, NotificationContext, ToastContext)
│   │   ├── hooks/
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
│   │   │   ├── SegmentsPage/
│   │   │   ├── ServiceTicketsPage/
│   │   │   ├── SettingsPage/
│   │   │   └── UsersPage/
│   │   ├── routes/ (AppRoutes, ProtectedRoute)
│   │   ├── services/ (api, authService, customerService, journeyService, ticketService, aiService, etc.)
│   │   ├── utils/ (formatters, constants)
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
│   │   ├── repositories/ (customerRepo, journeyRepo, ticketRepo, recommendationRepo, auditRepo, etc.)
│   │   ├── routes/ (index, authRoutes, customerRoutes, journeyRoutes, ticketRoutes, aiRoutes, etc.)
│   │   ├── services/ (journeyService, recommendationService, ruleEngine, consentService, auditService, etc.)
│   │   ├── utils/ (jwt, password, logger, response)
│   │   ├── validators/ (schemas for Zod)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_indexes_and_views.sql
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

## 16. Development Phases

1. **Phase 1 — Project Foundation**: Root workspace setup, frontend Vite + Tailwind setup, backend Express app setup, database structure, and shared scripts.
2. **Phase 2 — Database Architecture**: PostgreSQL schema definition with 31 entities, indexes, migrations, seeds (realistic jewellery customers, bespoke journeys, tickets, recommendations, certificates, audit logs).
3. **Phase 3 — Authentication & RBAC**: JWT + bcrypt authentication, role-based access control middleware, permission verification, and user management.
4. **Phase 4 — Unified Customer Profile & 10-Stage Journey**: Customer 360 aggregator, interaction timeline, journey stage transitions, and linked records (designs, hallmarking, certificates, repairs, sales).
5. **Phase 5 — Service Management & Agent Assist**: Service tickets, multi-channel conversations, ticket assignments, status lifecycles, and audit logging.
6. **Phase 6 — AI Intelligence Engine**: Gemini API integration, intent classification, sentiment analysis, churn & propensity scoring, conversation summary, and response drafting.
7. **Phase 7 — Consent Governance & HITL Workflow**: Consent verification, frequency capping, Next Best Action generator, Human Approval / Rejection / Override workflow with mandatory reasons.
8. **Phase 8 — Operations & Notifications**: Real-time notifications, audit trail inspector, system settings configuration.
9. **Phase 9 — Analytics & Model Outcomes**: Executive analytics dashboard, Recharts visualizations, CSV export, and AI accuracy/feedback loop metrics.
10. **Phase 10 — Quality Assurance, Polish & Documentation**: End-to-end testing, responsive design verification, security checks, and final documentation (`README.md`, `API.md`, `ARCHITECTURE.md`).

---

## 17. Testing Strategy
- **Backend API Tests**: Testing auth endpoints, RBAC permission rejections, customer retrieval, journey stage progression, AI recommendation generation, and approval/override validation.
- **Governance & Consent Tests**: Validating that opt-out customers are blocked from outreach, and frequency caps prevent spam.
- **Frontend E2E Flow**: Testing complete login -> customer profile -> journey update -> ticket creation -> AI recommendation approval -> audit log verification.

---

## 18. Security Checklist
- [x] Passwords securely hashed with bcrypt (salt rounds = 10).
- [x] JWT signed with secret and expiration.
- [x] Sensitive environment variables (`GEMINI_API_KEY`, `JWT_SECRET`, `DATABASE_URL`) isolated on backend only.
- [x] Parameterized SQL queries preventing SQL Injection.
- [x] Zod validation on all API input payloads.
- [x] Backend RBAC enforcement on all protected routes.
- [x] Immutable, append-only audit logging for all critical operations.
- [x] CORS configured with secure origin whitelisting and Helmet HTTP security headers.
