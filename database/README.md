# PostgreSQL Database Architecture & Schema Documentation

This directory contains the complete relational PostgreSQL schema, migrations, seed datasets, and runner scripts for the **Jewellery AI Customer Journey Orchestrator**.

## Directory Layout

```text
database/
├── migrations/
│   └── 001_initial_schema.sql
├── seeds/
│   └── 001_jewellery_retail_seed.sql
├── db-runner.js
├── schema.sql
└── README.md
```

## Relational Design Highlights

- **38 Normalized Relational Tables**:
  - `organisations`, `stores`, `roles`, `permissions`, `users`
  - `customers`, `customer_identity_links`, `customer_preferences`, `consents`, `channels`
  - `journeys`, `journey_stages`, `designs`, `materials`, `items`, `inventory`, `inventory_transfers`
  - `production_records`, `hallmark_records`, `consultations`, `sales`, `certificates`, `repairs`, `exchanges`
  - `interactions`, `service_tickets`, `conversations`, `messages`
  - `segments`, `campaigns`, `offers`
  - `model_versions`, `ai_runs`, `recommendations`, `approvals`, `outcomes`
  - `notifications`, `audit_logs`, `configuration`, `comments`, `attachments`
- **UUID Identifiers**: Stable, collision-free distributed IDs across all core records.
- **Foreign Keys with Cascade Actions**: Strict referential integrity enforcing domain boundaries.
- **Performance Indexes**: Multi-column and B-Tree indexes on search-intensive paths (`customer_id`, `email`, `status`, `stage`, `created_at`, `actor_id`).
- **Audit Trails**: Immutable, append-only logs for every user mutation, AI execution, and human approval/override.

## Running Migrations & Seeds

### Dual PostgreSQL Engine Support
1. **External PostgreSQL** (Standard): Set `DATABASE_URL=postgresql://user:password@localhost:5432/jewellery_orchestrator` in `backend/.env`.
2. **Embedded PostgreSQL** (Zero-Config): If no external PostgreSQL instance is provided, the system automatically uses `@electric-sql/pglite` (embedded WebAssembly PostgreSQL 16 engine), ensuring complete zero-setup portability on any developer workstation.

```bash
# Apply schema and seed data
npm run seed
```
