-- ============================================================================
-- JEWELLERY AI CUSTOMER JOURNEY ORCHESTRATOR
-- Relational PostgreSQL Schema Definition (v1.0.0)
-- ============================================================================

-- 1. ORGANISATIONS (Multi-store / Boutique enterprise hierarchy)
CREATE TABLE IF NOT EXISTS organisations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    headquarters_address TEXT,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STORES / BOUTIQUES
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(64) PRIMARY KEY,
    organisation_id VARCHAR(64) REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    address TEXT,
    phone VARCHAR(50),
    is_flagship BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ROLES (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PERMISSIONS
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(64) PRIMARY KEY,
    role_id VARCHAR(64) REFERENCES roles(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_role_resource_action UNIQUE (role_id, resource, action)
);

-- 5. USERS (Staff, Advisors, Artisans, Managers, Admins)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    organisation_id VARCHAR(64) REFERENCES organisations(id) ON DELETE SET NULL,
    store_id VARCHAR(64) REFERENCES stores(id) ON DELETE SET NULL,
    role_id VARCHAR(64) REFERENCES roles(id) ON DELETE RESTRICT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CHANNELS (Communication touchpoints)
CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    is_digital BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CUSTOMERS (Core Unified 360 Entity)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    organisation_id VARCHAR(64) REFERENCES organisations(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Silver' CHECK (tier IN ('VIP', 'Platinum', 'Gold', 'Silver', 'Elite Bespoke')),
    preferred_store_id VARCHAR(64) REFERENCES stores(id) ON DELETE SET NULL,
    assigned_advisor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    total_spend NUMERIC(14, 2) DEFAULT 0.00,
    lifetime_value NUMERIC(14, 2) DEFAULT 0.00,
    purchase_count INT DEFAULT 0,
    churn_risk_score NUMERIC(5, 2) DEFAULT 0.15, -- 0.00 to 1.00
    propensity_score NUMERIC(5, 2) DEFAULT 0.85, -- 0.00 to 1.00
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'dormant', 'at_risk', 'vip_high_touch', 'churned')),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CUSTOMER IDENTITY LINKS (Omnichannel unification)
CREATE TABLE IF NOT EXISTS customer_identity_links (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    identity_type VARCHAR(50) NOT NULL, -- 'phone', 'email', 'pan_card', 'loyalty_number', 'ecom_uid'
    identity_value VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CUSTOMER PREFERENCES (Jewellery-specific taste & sizing)
CREATE TABLE IF NOT EXISTS customer_preferences (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
    preferred_metal VARCHAR(50) DEFAULT '18K Yellow Gold',
    ring_size VARCHAR(20) DEFAULT '7 / 14 (Indian)',
    bangle_size VARCHAR(20) DEFAULT '2.4',
    favorite_gemstone VARCHAR(100) DEFAULT 'Natural Solitaire Diamond',
    diamond_cut_preference VARCHAR(50) DEFAULT 'Round Brilliant',
    design_aesthetic VARCHAR(100) DEFAULT 'Heritage Contemporary',
    anniversary_date DATE,
    birthday DATE,
    spouse_name VARCHAR(100),
    preferred_channel VARCHAR(50) DEFAULT 'whatsapp',
    contact_time_preference VARCHAR(50) DEFAULT 'Evening (5 PM - 8 PM)',
    budget_range VARCHAR(50) DEFAULT '₹3,00,000 - ₹10,00,000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. CONSENTS (Explicit regulatory & marketing consent per channel)
CREATE TABLE IF NOT EXISTS consents (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'email', 'whatsapp', 'phone', 'sms', 'in_person'
    is_consented BOOLEAN DEFAULT TRUE,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    opt_out_date TIMESTAMP WITH TIME ZONE,
    consent_source VARCHAR(100) DEFAULT 'Boutique Consultation Form',
    weekly_frequency_cap INT DEFAULT 2,
    messages_sent_this_week INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_customer_channel_consent UNIQUE (customer_id, channel)
);

-- 11. JOURNEYS (The 10-Stage Unified Lifecycle Instance)
CREATE TABLE IF NOT EXISTS journeys (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    current_stage VARCHAR(50) NOT NULL CHECK (current_stage IN (
        'design', 'sourcing', 'production', 'hallmarking', 'inventory_transfer',
        'consultation', 'sale', 'certification', 'repair', 'exchange'
    )),
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'on_hold', 'cancelled')),
    target_completion_date DATE,
    total_estimated_value NUMERIC(14, 2) DEFAULT 0.00,
    assigned_staff_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. JOURNEY STAGES (Milestone progression for each journey)
CREATE TABLE IF NOT EXISTS journey_stages (
    id VARCHAR(64) PRIMARY KEY,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE CASCADE,
    stage_name VARCHAR(50) NOT NULL,
    stage_order INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    owner_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. DESIGNS (Bespoke CAD, 3D Renders, Metal Specs)
CREATE TABLE IF NOT EXISTS designs (
    id VARCHAR(64) PRIMARY KEY,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    item_category VARCHAR(100) NOT NULL, -- 'Ring', 'Necklace', 'Earrings', 'Bangle', 'Pendant'
    metal_type VARCHAR(50) NOT NULL, -- '18K Yellow Gold', 'Platinum 950', '18K Rose Gold'
    metal_purity VARCHAR(20) DEFAULT '18K / 750',
    gemstone_details TEXT,
    estimated_weight_grams NUMERIC(8, 3),
    cad_render_url TEXT,
    approval_status VARCHAR(50) DEFAULT 'approved_by_client' CHECK (approval_status IN ('draft', 'pending_approval', 'approved_by_client', 'revision_requested')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. MATERIALS (Precious metals, stones, diamonds catalog)
CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'metal', 'diamond', 'gemstone', 'alloy'
    purity VARCHAR(50),
    unit_of_measure VARCHAR(20) DEFAULT 'grams',
    cost_per_unit NUMERIC(12, 2) NOT NULL,
    current_market_rate NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. ITEMS / MASTER JEWELLERY PRODUCTS
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(64) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    collection_name VARCHAR(100),
    metal_type VARCHAR(50) NOT NULL,
    metal_weight_grams NUMERIC(8, 3),
    diamond_carat_total NUMERIC(6, 3) DEFAULT 0.00,
    price NUMERIC(14, 2) NOT NULL,
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. INVENTORY (Store & Vault stock)
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(64) PRIMARY KEY,
    item_id VARCHAR(64) REFERENCES items(id) ON DELETE CASCADE,
    store_id VARCHAR(64) REFERENCES stores(id) ON DELETE SET NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'in_vault' CHECK (status IN ('in_vault', 'in_transit', 'on_display', 'reserved_for_client', 'sold', 'in_repair')),
    vault_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. PRODUCTION RECORDS (Artisan Atelier Handcrafting)
CREATE TABLE IF NOT EXISTS production_records (
    id VARCHAR(64) PRIMARY KEY,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE CASCADE,
    design_id VARCHAR(64) REFERENCES designs(id) ON DELETE SET NULL,
    artisan_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    workshop_name VARCHAR(150) NOT NULL,
    casting_date DATE,
    stone_setting_date DATE,
    polishing_date DATE,
    qc_inspector_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    qc_status VARCHAR(50) DEFAULT 'passed' CHECK (qc_status IN ('pending', 'passed', 'failed', 'rework_needed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. HALLMARK RECORDS (Assay Office Purity & Laser Inscription)
CREATE TABLE IF NOT EXISTS hallmark_records (
    id VARCHAR(64) PRIMARY KEY,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE CASCADE,
    assay_office VARCHAR(150) NOT NULL, -- e.g. 'Bureau of Indian Standards (BIS) Assay Centre Mumbai'
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    purity_verified VARCHAR(50) NOT NULL, -- '916 (22K)', '750 (18K)', '950 Pt'
    laser_inscribed_text VARCHAR(150),
    certified_date DATE NOT NULL,
    verification_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. INVENTORY TRANSFERS (Armored Boutique Transit)
CREATE TABLE IF NOT EXISTS inventory_transfers (
    id VARCHAR(64) PRIMARY KEY,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE SET NULL,
    inventory_id VARCHAR(64) REFERENCES inventory(id) ON DELETE CASCADE,
    source_location VARCHAR(150) NOT NULL,
    destination_location VARCHAR(150) NOT NULL,
    carrier VARCHAR(100) DEFAULT 'Brinks Armored Logistics',
    tracking_number VARCHAR(100),
    transit_status VARCHAR(50) DEFAULT 'delivered' CHECK (transit_status IN ('initiated', 'in_transit', 'delivered', 'received_in_vault')),
    dispatched_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    verified_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. CONSULTATIONS (Private VIP Salon Appointments)
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE SET NULL,
    store_id VARCHAR(64) REFERENCES stores(id) ON DELETE SET NULL,
    advisor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 60,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    viewing_items TEXT,
    client_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. SALES (High-ticket retail transactions)
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE SET NULL,
    store_id VARCHAR(64) REFERENCES stores(id) ON DELETE SET NULL,
    sales_advisor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    tax_amount NUMERIC(14, 2) DEFAULT 0.00,
    discount_amount NUMERIC(14, 2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'Bank Wire Transfer',
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. CERTIFICATES (GIA, IGI, SGL Gemological Certificates)
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    sale_id VARCHAR(64) REFERENCES sales(id) ON DELETE SET NULL,
    certificate_authority VARCHAR(50) NOT NULL, -- 'GIA', 'IGI', 'SGL', 'HRD Antwerp'
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    item_title VARCHAR(255) NOT NULL,
    carat_weight NUMERIC(6, 3) NOT NULL,
    color_grade VARCHAR(20) NOT NULL, -- 'D', 'E', 'F', 'G', etc.
    clarity_grade VARCHAR(20) NOT NULL, -- 'VVS1', 'VVS2', 'VS1', 'IF'
    cut_grade VARCHAR(20) NOT NULL, -- 'Excellent', 'Ideal'
    polish VARCHAR(20) DEFAULT 'Excellent',
    symmetry VARCHAR(20) DEFAULT 'Excellent',
    fluorescence VARCHAR(20) DEFAULT 'None',
    pdf_url TEXT,
    issued_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. REPAIRS (Atelier restoration, resizing, cleaning)
CREATE TABLE IF NOT EXISTS repairs (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    item_description VARCHAR(255) NOT NULL,
    issue_type VARCHAR(100) NOT NULL, -- 'Resizing', 'Prong Tightening', 'Rhodium Polishing', 'Gemstone Resetting'
    status VARCHAR(50) DEFAULT 'in_atelier' CHECK (status IN ('received', 'in_atelier', 'ready_for_pickup', 'delivered')),
    estimated_cost NUMERIC(12, 2) DEFAULT 0.00,
    actual_cost NUMERIC(12, 2) DEFAULT 0.00,
    promised_date DATE NOT NULL,
    delivered_date DATE,
    assigned_artisan_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. EXCHANGES (Lifetime Upgrade & Buy-Back appraisals)
CREATE TABLE IF NOT EXISTS exchanges (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    original_item_description VARCHAR(255) NOT NULL,
    original_value NUMERIC(14, 2) NOT NULL,
    trade_in_allowance NUMERIC(14, 2) NOT NULL,
    upgraded_item_sku VARCHAR(100),
    balance_payable NUMERIC(14, 2) NOT NULL,
    appraisal_notes TEXT,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('appraisal_pending', 'approved', 'completed', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. INTERACTIONS (Omnichannel communication log)
CREATE TABLE IF NOT EXISTS interactions (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE SET NULL,
    channel VARCHAR(50) NOT NULL, -- 'email', 'whatsapp', 'phone', 'in_person'
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    subject VARCHAR(255) NOT NULL,
    summary TEXT,
    raw_content TEXT NOT NULL,
    sentiment VARCHAR(30) DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative', 'frustrated')),
    sentiment_score NUMERIC(5, 2) DEFAULT 0.70,
    intent VARCHAR(100),
    staff_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 26. SERVICE TICKETS (Concierge issue resolution)
CREATE TABLE IF NOT EXISTS service_tickets (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Repair Status Inquiry', 'Bespoke Customization', 'Valuation & Appraisal', 'Delivery Escalation'
    priority VARCHAR(30) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'pending_approval', 'resolved', 'closed')),
    assigned_agent_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    churn_indicator VARCHAR(30) DEFAULT 'low' CHECK (churn_indicator IN ('low', 'medium', 'high')),
    sentiment VARCHAR(30) DEFAULT 'neutral',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 27. CONVERSATIONS & MESSAGES (Agent assist chat turns)
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) REFERENCES service_tickets(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    channel VARCHAR(50) DEFAULT 'whatsapp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(30) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system', 'ai')),
    sender_id VARCHAR(64),
    message_text TEXT NOT NULL,
    is_ai_draft BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 28. SEGMENTS (Dynamic customer segmentation)
CREATE TABLE IF NOT EXISTS segments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    criteria JSONB DEFAULT '{}'::jsonb,
    customer_count INT DEFAULT 0,
    created_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 29. CAMPAIGNS & OFFERS
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    segment_id VARCHAR(64) REFERENCES segments(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    scheduled_date DATE,
    total_targeted INT DEFAULT 0,
    total_engaged INT DEFAULT 0,
    total_converted INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(64) PRIMARY KEY,
    campaign_id VARCHAR(64) REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    discount_percentage NUMERIC(5, 2),
    valid_until DATE,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 30. MODEL VERSIONS (AI Governance & Traceability)
CREATE TABLE IF NOT EXISTS model_versions (
    id VARCHAR(64) PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL, -- e.g. 'gemini-1.5-flash', 'gemini-pro-jewellery-v2'
    version_tag VARCHAR(50) NOT NULL,
    provider VARCHAR(50) DEFAULT 'Google Gemini',
    prompt_template TEXT,
    confidence_threshold NUMERIC(5, 2) DEFAULT 0.75,
    is_active BOOLEAN DEFAULT TRUE,
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 31. AI RUNS (Traceability snapshot of every Gemini inference)
CREATE TABLE IF NOT EXISTS ai_runs (
    id VARCHAR(64) PRIMARY KEY,
    model_version_id VARCHAR(64) REFERENCES model_versions(id) ON DELETE SET NULL,
    task_type VARCHAR(50) NOT NULL, -- 'intent', 'sentiment', 'summary', 'nba', 'draft_response', 'churn_prediction'
    input_snapshot JSONB NOT NULL,
    output_payload JSONB NOT NULL,
    latency_ms INT DEFAULT 0,
    confidence NUMERIC(5, 2) DEFAULT 0.85,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 32. RECOMMENDATIONS (AI Next Best Action with deterministic governance)
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    journey_id VARCHAR(64) REFERENCES journeys(id) ON DELETE SET NULL,
    ticket_id VARCHAR(64) REFERENCES service_tickets(id) ON DELETE SET NULL,
    recommendation_type VARCHAR(100) NOT NULL, -- 'repair_status_update', 'bespoke_cad_invitation', 'anniversary_vip_catalog', 'high_churn_concierge_call'
    recommended_action TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    explanation TEXT NOT NULL,
    evidence JSONB DEFAULT '[]'::jsonb,
    model_version VARCHAR(50) DEFAULT 'gemini-1.5-pro',
    status VARCHAR(50) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'overridden', 'completed')),
    consent_verified BOOLEAN DEFAULT TRUE,
    eligibility_verified BOOLEAN DEFAULT TRUE,
    frequency_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 33. APPROVALS & OVERRIDES (Human-in-the-Loop decision records)
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(64) PRIMARY KEY,
    recommendation_id VARCHAR(64) REFERENCES recommendations(id) ON DELETE CASCADE,
    reviewer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    decision VARCHAR(30) NOT NULL CHECK (decision IN ('approved', 'rejected', 'overridden')),
    override_reason TEXT,
    previous_recommendation TEXT,
    final_action_taken TEXT NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 34. OUTCOMES (Model feedback & customer conversion tracking)
CREATE TABLE IF NOT EXISTS outcomes (
    id VARCHAR(64) PRIMARY KEY,
    recommendation_id VARCHAR(64) REFERENCES recommendations(id) ON DELETE CASCADE,
    approval_id VARCHAR(64) REFERENCES approvals(id) ON DELETE SET NULL,
    customer_response VARCHAR(50) DEFAULT 'accepted' CHECK (customer_response IN ('accepted', 'declined', 'converted', 'no_response', 'unsubscribed')),
    conversion_value NUMERIC(14, 2) DEFAULT 0.00,
    feedback_score VARCHAR(30) DEFAULT 'helpful' CHECK (feedback_score IN ('helpful', 'not_helpful', 'incorrect', 'correct', 'override_better')),
    feedback_notes TEXT,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 35. NOTIFICATIONS (Live Alerts & Event Center)
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'ticket_assigned', 'ai_approval_needed', 'journey_update', 'overdue_alert', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    urgency VARCHAR(30) DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
    link_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 36. AUDIT LOGS (Immutable security & governance trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64),
    actor_name VARCHAR(150),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL, -- 'LOGIN', 'DATA_ACCESS', 'CREATE', 'UPDATE', 'DELETE', 'AI_EXECUTION', 'APPROVE_RECOMMENDATION', 'REJECT_RECOMMENDATION', 'OVERRIDE_RECOMMENDATION', 'EXPORT_DATA', 'SYSTEM_SETTING_CHANGE'
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(64),
    previous_value JSONB,
    new_value JSONB,
    reason TEXT,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 37. CONFIGURATION (System settings & AI thresholds)
CREATE TABLE IF NOT EXISTS configuration (
    id VARCHAR(64) PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 38. COMMENTS & ATTACHMENTS
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attachments (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes INT,
    mime_type VARCHAR(100),
    uploaded_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_journeys_customer ON journeys(customer_id);
CREATE INDEX IF NOT EXISTS idx_journeys_stage ON journeys(current_stage);
CREATE INDEX IF NOT EXISTS idx_journey_stages_journey ON journey_stages(journey_id);
CREATE INDEX IF NOT EXISTS idx_interactions_customer ON interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_sentiment ON interactions(sentiment);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON service_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON service_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON service_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_customer ON recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consents_customer ON consents(customer_id);
