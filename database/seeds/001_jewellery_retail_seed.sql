-- ============================================================================
-- JEWELLERY AI CUSTOMER JOURNEY ORCHESTRATOR - SEED DATA
-- Realistic Luxury Jewellery Retail Dataset
-- ============================================================================

-- 1. ORGANISATIONS
INSERT INTO organisations (id, name, code, currency, headquarters_address, contact_email)
VALUES 
('org_aurum_luxury', 'Aurum & Co. High Jewellery Group', 'AURUM-HQ', 'INR', 'Heritage Tower, Nariman Point, Mumbai 400021, India', 'concierge@aurumjewellery.com')
ON CONFLICT (id) DO NOTHING;

-- 2. STORES / BOUTIQUES
INSERT INTO stores (id, organisation_id, name, code, city, state, address, phone, is_flagship)
VALUES
('store_mumbai_flagship', 'org_aurum_luxury', 'Mumbai Flagship Boutique & Atelier', 'BOM-01', 'Mumbai', 'Maharashtra', 'Colaba Causeway, Luxury Heritage Promenade, Mumbai', '+91 22 4890 1000', TRUE),
('store_bangalore_ubcity', 'org_aurum_luxury', 'Bangalore UB City Salon', 'BLR-01', 'Bangalore', 'Karnataka', 'Level 2, UB City Collection, Vittal Mallya Road, Bangalore', '+91 80 6712 3000', TRUE),
('store_delhi_southext', 'org_aurum_luxury', 'Delhi South Extension VIP Lounge', 'DEL-01', 'New Delhi', 'Delhi', 'South Extension Part II, Ring Road, New Delhi', '+91 11 4100 8000', FALSE),
('store_hyderabad_jubilee', 'org_aurum_luxury', 'Hyderabad Jubilee Hills Private Vault', 'HYD-01', 'Hyderabad', 'Telangana', 'Road No. 36, Jubilee Hills, Hyderabad', '+91 40 2355 9000', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 3. ROLES
INSERT INTO roles (id, name, display_name, description)
VALUES
('role_admin', 'admin', 'System Administrator / Executive', 'Full system configuration, user management, audit logs, and global overrides'),
('role_sales_manager', 'sales_manager', 'Sales Manager / Salon Director', 'Oversees VIP customer journeys, approvals, sales performance, and high-ticket overrides'),
('role_marketing_manager', 'marketing_manager', 'Marketing Manager', 'Creates customer segments, campaign orchestration, channel governance, and outcome analytics'),
('role_service_agent', 'service_agent', 'Service Agent / VIP Concierge', 'Customer service tickets, AI-assisted drafts, repair coordination, and consultation booking'),
('role_customer', 'customer', 'Customer (Self-Service)', 'Client portal view for orders, journeys, GIA certificates, and repair tracking')
ON CONFLICT (id) DO NOTHING;

-- 4. PERMISSIONS
INSERT INTO permissions (id, role_id, resource, action)
VALUES
-- Admin permissions
('perm_adm_cust_all', 'role_admin', 'customers', 'all'),
('perm_adm_jour_all', 'role_admin', 'journeys', 'all'),
('perm_adm_tick_all', 'role_admin', 'tickets', 'all'),
('perm_adm_ai_all', 'role_admin', 'ai', 'all'),
('perm_adm_rec_all', 'role_admin', 'recommendations', 'all'),
('perm_adm_usr_all', 'role_admin', 'users', 'all'),
('perm_adm_aud_all', 'role_admin', 'audit_logs', 'read'),
('perm_adm_set_all', 'role_admin', 'settings', 'configure'),

-- Sales Manager permissions
('perm_sm_cust_rw', 'role_sales_manager', 'customers', 'update'),
('perm_sm_jour_rw', 'role_sales_manager', 'journeys', 'update'),
('perm_sm_rec_app', 'role_sales_manager', 'recommendations', 'approve'),
('perm_sm_rec_ovr', 'role_sales_manager', 'recommendations', 'override'),
('perm_sm_tick_rw', 'role_sales_manager', 'tickets', 'update'),
('perm_sm_ana_ro', 'role_sales_manager', 'analytics', 'read'),

-- Marketing Manager permissions
('perm_mm_seg_all', 'role_marketing_manager', 'segments', 'all'),
('perm_mm_cam_all', 'role_marketing_manager', 'campaigns', 'all'),
('perm_mm_rec_app', 'role_marketing_manager', 'recommendations', 'approve'),
('perm_mm_rec_rej', 'role_marketing_manager', 'recommendations', 'reject'),
('perm_mm_ana_all', 'role_marketing_manager', 'analytics', 'all'),

-- Service Agent permissions
('perm_sa_tick_all', 'role_service_agent', 'tickets', 'all'),
('perm_sa_cust_ro', 'role_service_agent', 'customers', 'read'),
('perm_sa_jour_up', 'role_service_agent', 'journeys', 'update'),
('perm_sa_ai_draft', 'role_service_agent', 'ai', 'draft')
ON CONFLICT (id) DO NOTHING;

-- 5. USERS (bcrypt for 'password123' is $2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei)
INSERT INTO users (id, organisation_id, store_id, role_id, email, password_hash, first_name, last_name, phone, title)
VALUES
('user_admin_01', 'org_aurum_luxury', 'store_mumbai_flagship', 'role_admin', 'admin@aurumjewellery.com', '$2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei', 'Aarav', 'Singhal', '+91 98200 11223', 'Chief Operating Officer & Admin'),
('user_sales_mgr_01', 'org_aurum_luxury', 'store_mumbai_flagship', 'role_sales_manager', 'sales.manager@aurumjewellery.com', '$2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei', 'Kavita', 'Deshmukh', '+91 98201 22334', 'Senior Director of Private Sales'),
('user_mktg_mgr_01', 'org_aurum_luxury', 'store_bangalore_ubcity', 'role_marketing_manager', 'marketing@aurumjewellery.com', '$2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei', 'Rohan', 'Verma', '+91 98450 33445', 'Head of Omnichannel Marketing'),
('user_service_agent_01', 'org_aurum_luxury', 'store_mumbai_flagship', 'role_service_agent', 'service@aurumjewellery.com', '$2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei', 'Neha', 'Kapoor', '+91 98202 44556', 'Senior Client Concierge Specialist'),
('user_artisan_01', 'org_aurum_luxury', 'store_mumbai_flagship', 'role_service_agent', 'artisan.atelier@aurumjewellery.com', '$2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei', 'Master', 'Gopal Rao', '+91 98203 55667', 'Master Goldsmith & Stone Setter'),
('user_customer_rahul', 'org_aurum_luxury', 'store_mumbai_flagship', 'role_customer', 'rahul.sharma@example.com', '$2a$10$8K1p/a0dL1LXMIg6jV3wtuW4i/LZeD.8rO4Y.hL44u16gK1mDqYei', 'Rahul', 'Sharma', '+91 98200 99881', 'Private Client')
ON CONFLICT (id) DO NOTHING;

-- 6. CHANNELS
INSERT INTO channels (id, name, display_name, is_digital)
VALUES
('chan_whatsapp', 'whatsapp', 'WhatsApp Business VIP', TRUE),
('chan_email', 'email', 'Concierge Email', TRUE),
('chan_phone', 'phone', 'Private Telephonic Consultation', FALSE),
('chan_sms', 'sms', 'Transactional SMS', TRUE),
('chan_in_person', 'in_person', 'Private VIP Salon Appointment', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 7. CUSTOMERS (Unified 360 Profiles)
INSERT INTO customers (id, organisation_id, first_name, last_name, email, phone, tier, preferred_store_id, assigned_advisor_id, total_spend, lifetime_value, purchase_count, churn_risk_score, propensity_score, status, notes)
VALUES
('cust_rahul_sharma', 'org_aurum_luxury', 'Rahul', 'Sharma', 'rahul.sharma@example.com', '+91 98200 99881', 'VIP', 'store_mumbai_flagship', 'user_sales_mgr_01', 1850000.00, 2400000.00, 4, 0.78, 0.88, 'at_risk', 'High-net-worth investor. Inquired multiple times regarding delayed diamond ring repair. Highly sensitive to delivery timelines.'),
('cust_priya_reddy', 'org_aurum_luxury', 'Priya', 'Reddy', 'priya.reddy@example.com', '+91 98450 77662', 'Elite Bespoke', 'store_bangalore_ubcity', 'user_sales_mgr_01', 4200000.00, 6500000.00, 7, 0.08, 0.94, 'vip_high_touch', 'Bespoke bridal patron. Prefers Colombian emeralds and 950 Platinum. Anniversary approaching on Dec 14.'),
('cust_ananya_rao', 'org_aurum_luxury', 'Ananya', 'Rao', 'ananya.rao@example.com', '+91 98201 55443', 'Platinum', 'store_mumbai_flagship', 'user_service_agent_01', 1250000.00, 1800000.00, 3, 0.22, 0.75, 'active', 'Prefers contemporary rose gold and solitaire diamond studs. Regularly attends private viewing galas.'),
('cust_arjun_mehta', 'org_aurum_luxury', 'Arjun', 'Mehta', 'arjun.mehta@example.com', '+91 98110 33221', 'Gold', 'store_delhi_southext', 'user_sales_mgr_01', 890000.00, 1200000.00, 2, 0.45, 0.60, 'active', 'Looking to upgrade wedding band to a bespoke platinum-emerald cut band.'),
('cust_vikram_singhania', 'org_aurum_luxury', 'Vikram', 'Singhania', 'vikram.s@example.com', '+91 98205 11990', 'VIP', 'store_mumbai_flagship', 'user_sales_mgr_01', 5800000.00, 8000000.00, 9, 0.12, 0.96, 'vip_high_touch', 'Patron of royal temple collection. Prefers unheated rubies and certified natural Burma pearls.'),
('cust_meera_kapoor', 'org_aurum_luxury', 'Meera', 'Kapoor', 'meera.k@example.com', '+91 98100 44332', 'Silver', 'store_delhi_southext', 'user_service_agent_01', 340000.00, 500000.00, 1, 0.35, 0.70, 'active', 'Recent purchaser of 18K yellow gold floral diamond pendant. Interested in matching earrings.')
ON CONFLICT (id) DO NOTHING;

-- 8. CUSTOMER IDENTITY LINKS
INSERT INTO customer_identity_links (id, customer_id, identity_type, identity_value, is_verified)
VALUES
('link_rahul_01', 'cust_rahul_sharma', 'pan_card', 'ABCPS1234F', TRUE),
('link_rahul_02', 'cust_rahul_sharma', 'phone', '+919820099881', TRUE),
('link_priya_01', 'cust_priya_reddy', 'pan_card', 'XYZPR5678K', TRUE),
('link_priya_02', 'cust_priya_reddy', 'loyalty_number', 'AURUM-VIP-8890', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 9. CUSTOMER PREFERENCES
INSERT INTO customer_preferences (id, customer_id, preferred_metal, ring_size, bangle_size, favorite_gemstone, diamond_cut_preference, design_aesthetic, anniversary_date, birthday, spouse_name, preferred_channel, contact_time_preference, budget_range)
VALUES
('pref_rahul', 'cust_rahul_sharma', 'Platinum 950', '14 (Indian) / 7 (US)', '2.4', 'Natural Solitaire Diamond', 'Round Brilliant', 'Classic Solitaire & Prong Set', '2020-11-20', '1988-04-15', 'Ritika Sharma', 'whatsapp', 'Evening (5 PM - 8 PM)', '₹5,00,000 - ₹15,00,000'),
('pref_priya', 'cust_priya_reddy', '18K Yellow Gold & Platinum', '12 (Indian) / 6 (US)', '2.6', 'Colombian Emerald & Pear Diamond', 'Emerald Cut', 'Royal Heritage & Contemporary Fusion', '2018-12-14', '1990-08-22', 'Siddharth Reddy', 'whatsapp', 'Afternoon (2 PM - 5 PM)', '₹15,00,000 - ₹50,00,000'),
('pref_ananya', 'cust_ananya_rao', '18K Rose Gold', '11 (Indian)', '2.4', 'Round Diamond & Pink Sapphire', 'Cushion Cut', 'Modern Minimalist Luxury', '2022-02-14', '1995-10-05', 'Nikhil Rao', 'email', 'Morning (10 AM - 1 PM)', '₹3,00,000 - ₹8,00,000')
ON CONFLICT (id) DO NOTHING;

-- 10. CONSENTS (Explicit regulatory compliance)
INSERT INTO consents (id, customer_id, channel, is_consented, consent_date, opt_out_date, consent_source, weekly_frequency_cap, messages_sent_this_week)
VALUES
('cons_rahul_wa', 'cust_rahul_sharma', 'whatsapp', TRUE, CURRENT_TIMESTAMP, NULL, 'Boutique Consultation Form', 3, 1),
('cons_rahul_em', 'cust_rahul_sharma', 'email', TRUE, CURRENT_TIMESTAMP, NULL, 'Digital VIP Portal', 2, 0),
('cons_rahul_ph', 'cust_rahul_sharma', 'phone', TRUE, CURRENT_TIMESTAMP, NULL, 'Concierge Agreement', 1, 0),
('cons_rahul_sms', 'cust_rahul_sharma', 'sms', FALSE, NULL, '2026-01-10', 'Customer Unsubscribe Request', 0, 0),

('cons_priya_wa', 'cust_priya_reddy', 'whatsapp', TRUE, CURRENT_TIMESTAMP, NULL, 'In-Store Salon Tablet', 4, 1),
('cons_priya_em', 'cust_priya_reddy', 'email', TRUE, CURRENT_TIMESTAMP, NULL, 'Boutique Signup', 2, 0),

('cons_ananya_wa', 'cust_ananya_rao', 'whatsapp', FALSE, NULL, '2026-02-01', 'Opt-out via WhatsApp reply STOP', 0, 0),
('cons_ananya_em', 'cust_ananya_rao', 'email', TRUE, CURRENT_TIMESTAMP, NULL, 'Gala Registration', 3, 1)
ON CONFLICT (id) DO NOTHING;

-- 11. JOURNEYS (Unified 10-Stage Customer Journeys)
INSERT INTO journeys (id, customer_id, title, current_stage, status, target_completion_date, total_estimated_value, assigned_staff_id, notes)
VALUES
('jour_rahul_ring', 'cust_rahul_sharma', 'Bespoke Solitaire Diamond Ring & Lifetime Care', 'repair', 'in_progress', '2026-08-15', 850000.00, 'user_service_agent_01', 'Customer experiencing anxiety over prong tightening delay. High churn risk.'),
('jour_priya_bridal', 'cust_priya_reddy', 'Imperial Emerald & Diamond Royal Bridal Choker', 'production', 'in_progress', '2026-09-30', 3800000.00, 'user_sales_mgr_01', 'Artisan setting 24 carats of Muzo emeralds with micro-pavé diamonds.'),
('jour_ananya_studs', 'cust_ananya_rao', 'Twin Solitaire Platinum Studs & Certification', 'certification', 'completed', '2026-07-20', 620000.00, 'user_sales_mgr_01', 'GIA certification issued. Successfully collected at Mumbai Flagship.')
ON CONFLICT (id) DO NOTHING;

-- 12. JOURNEY STAGES (Milestones across the 10 stages)
INSERT INTO journey_stages (id, journey_id, stage_name, stage_order, status, owner_id, started_at, completed_at, notes, metadata)
VALUES
-- Rahul Sharma's 10-Stage Lifecycle
('stg_r_01', 'jour_rahul_ring', 'design', 1, 'completed', 'user_sales_mgr_01', '2025-10-01', '2025-10-07', 'CAD 3D rendering approved by Rahul for 2.01ct Round Brilliant ring', '{"cad_version": "v3.2", "metal": "Platinum 950"}'::jsonb),
('stg_r_02', 'jour_rahul_ring', 'sourcing', 2, 'completed', 'user_sales_mgr_01', '2025-10-08', '2025-10-15', 'Sourced 2.01ct D-VVS1 Triple Excellent Diamond from Antwerp vault', '{"origin": "Antwerp", "carat": 2.01}'::jsonb),
('stg_r_03', 'jour_rahul_ring', 'production', 3, 'completed', 'user_artisan_01', '2025-10-16', '2025-11-02', 'Handcrafted 6-prong platinum crown setting at Mumbai Atelier', '{"artisan": "Master Gopal Rao"}'::jsonb),
('stg_r_04', 'jour_rahul_ring', 'hallmarking', 4, 'completed', 'user_admin_01', '2025-11-03', '2025-11-05', 'BIS Hallmark 950 Pt laser inscribed (BIS-MUM-950-8812)', '{"purity": "950 Pt", "assay": "BIS Mumbai"}'::jsonb),
('stg_r_05', 'jour_rahul_ring', 'inventory_transfer', 5, 'completed', 'user_admin_01', '2025-11-06', '2025-11-07', 'Armored transit from Central Vault to Colaba Flagship store', '{"carrier": "Brinks Armored"}'::jsonb),
('stg_r_06', 'jour_rahul_ring', 'consultation', 6, 'completed', 'user_sales_mgr_01', '2025-11-08', '2025-11-08', 'VIP Champagne Salon viewing. Rahul inspected the completed ring', '{"feedback": "Exceeded expectations"}'::jsonb),
('stg_r_07', 'jour_rahul_ring', 'sale', 7, 'completed', 'user_sales_mgr_01', '2025-11-09', '2025-11-09', 'Invoice #AUR-2025-8812 cleared via Bank Wire Transfer (₹8,50,000)', '{"invoice": "AUR-2025-8812", "amount": 850000}'::jsonb),
('stg_r_08', 'jour_rahul_ring', 'certification', 8, 'completed', 'user_sales_mgr_01', '2025-11-09', '2025-11-09', 'GIA Dossier Report #2218903445 handed over in leather binder', '{"gia_number": "2218903445"}'::jsonb),
('stg_r_09', 'jour_rahul_ring', 'repair', 9, 'in_progress', 'user_service_agent_01', '2026-08-01', NULL, 'Periodic complimentary prong inspection and ultrasonic rhodium buffing. Currently in atelier.', '{"delay_reason": "Extra diamond re-polishing required"}'::jsonb),
('stg_r_10', 'jour_rahul_ring', 'exchange', 10, 'pending', 'user_sales_mgr_01', NULL, NULL, 'Lifetime exchange upgrade eligibility calculated at 100% metal value, 90% diamond value', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 13. DESIGNS
INSERT INTO designs (id, journey_id, customer_id, title, item_category, metal_type, metal_purity, gemstone_details, estimated_weight_grams, cad_render_url, approval_status)
VALUES
('dsg_rahul_01', 'jour_rahul_ring', 'cust_rahul_sharma', 'Crown Solitaire 6-Prong Diamond Ring', 'Ring', 'Platinum 950', '950 Pt', '2.01 ct D/VVS1 Round Brilliant Center Diamond', 6.450, '/assets/renders/solitaire_ring_cad.png', 'approved_by_client'),
('dsg_priya_01', 'jour_priya_bridal', 'cust_priya_reddy', 'Mughal Splendour Emerald & Diamond Choker', 'Necklace', '18K Yellow Gold', '18K / 750', '24.50 ct Muzo Colombian Emeralds & 12.80 ct Uncut Polki Diamonds', 88.200, '/assets/renders/emerald_choker_cad.png', 'approved_by_client')
ON CONFLICT (id) DO NOTHING;

-- 14. MATERIALS
INSERT INTO materials (id, name, type, purity, unit_of_measure, cost_per_unit, current_market_rate)
VALUES
('mat_gold_22k', '22 Karat Yellow Gold', 'metal', '916 (22K)', 'grams', 6850.00, 7150.00),
('mat_gold_18k', '18 Karat Rose Gold', 'metal', '750 (18K)', 'grams', 5600.00, 5850.00),
('mat_plat_950', 'Platinum 950 Fine Bullion', 'metal', '950 Pt', 'grams', 3400.00, 3650.00),
('mat_dia_round_2ct', 'Natural Diamond 2.01ct D/VVS1', 'diamond', 'D/VVS1 3EX', 'carats', 380000.00, 420000.00)
ON CONFLICT (id) DO NOTHING;

-- 15. ITEMS
INSERT INTO items (id, sku, name, category, collection_name, metal_type, metal_weight_grams, diamond_carat_total, price, description)
VALUES
('item_aur_rng_01', 'AUR-RNG-SOL-01', 'Empress Solitaire Diamond Ring (2.01ct)', 'Rings', 'Imperial Solitaires', 'Platinum 950', 6.450, 2.010, 850000.00, 'Handcrafted 6-prong platinum solitaire featuring a GIA certified D-VVS1 natural diamond.'),
('item_aur_nck_01', 'AUR-NCK-EMR-01', 'Royal Muzo Emerald & Polki Choker', 'Necklaces', 'Heritage Royal Collection', '18K Yellow Gold', 88.200, 12.800, 3800000.00, 'Imperial choker handcrafted with Colombian emerald drops and certified uncut polki diamonds.'),
('item_aur_std_01', 'AUR-STD-DIA-02', 'Celeste Twin Diamond Solitaire Studs', 'Earrings', 'Celeste Contemporary', 'Platinum 950', 4.200, 1.500, 620000.00, 'Pair of matched round brilliant diamonds in 4-prong platinum basket studs.')
ON CONFLICT (id) DO NOTHING;

-- 16. INVENTORY
INSERT INTO inventory (id, item_id, store_id, serial_number, status, vault_location)
VALUES
('inv_rahul_ring', 'item_aur_rng_01', 'store_mumbai_flagship', 'SN-AUR-8812-BOM', 'in_repair', 'Atelier Restoration Tray #4'),
('inv_priya_choker', 'item_aur_nck_01', 'store_mumbai_flagship', 'SN-AUR-9901-BOM', 'reserved_for_client', 'Master Safe Box #12')
ON CONFLICT (id) DO NOTHING;

-- 17. PRODUCTION RECORDS
INSERT INTO production_records (id, journey_id, design_id, artisan_id, workshop_name, casting_date, stone_setting_date, polishing_date, qc_status, notes)
VALUES
('prod_rahul_01', 'jour_rahul_ring', 'dsg_rahul_01', 'user_artisan_01', 'Aurum Central High-Jewellery Atelier Mumbai', '2025-10-18', '2025-10-25', '2025-10-30', 'passed', 'Master setting verified under 40x microscope. Zero porosity in platinum shank.')
ON CONFLICT (id) DO NOTHING;

-- 18. HALLMARK RECORDS
INSERT INTO hallmark_records (id, journey_id, assay_office, certificate_number, purity_verified, laser_inscribed_text, certified_date)
VALUES
('hall_rahul_01', 'jour_rahul_ring', 'Bureau of Indian Standards (BIS) Assay Centre Mumbai', 'BIS-MUM-950-8812', '950 Pt', 'AURUM 950Pt GIA-2218903445', '2025-11-04')
ON CONFLICT (id) DO NOTHING;

-- 19. INVENTORY TRANSFERS
INSERT INTO inventory_transfers (id, journey_id, inventory_id, source_location, destination_location, transit_status, dispatched_at, received_at)
VALUES
('trf_rahul_01', 'jour_rahul_ring', 'inv_rahul_ring', 'Central Vault Mumbai', 'Mumbai Flagship Boutique', 'received_in_vault', '2025-11-06 10:00:00+05:30', '2025-11-07 15:30:00+05:30')
ON CONFLICT (id) DO NOTHING;

-- 20. CONSULTATIONS
INSERT INTO consultations (id, customer_id, journey_id, store_id, advisor_id, scheduled_at, duration_minutes, status, viewing_items, client_feedback)
VALUES
('cons_rahul_01', 'cust_rahul_sharma', 'jour_rahul_ring', 'store_mumbai_flagship', 'user_sales_mgr_01', '2025-11-08 17:00:00+05:30', 90, 'completed', 'Bespoke Platinum 2.01ct Solitaire Ring', 'Client thrilled with craftsmanship. Requested matching platinum wedding band consultation for anniversary.')
ON CONFLICT (id) DO NOTHING;

-- 21. SALES
INSERT INTO sales (id, customer_id, journey_id, store_id, sales_advisor_id, invoice_number, total_amount, tax_amount, discount_amount, payment_method, sale_date)
VALUES
('sale_rahul_01', 'cust_rahul_sharma', 'jour_rahul_ring', 'store_mumbai_flagship', 'user_sales_mgr_01', 'INV-AUR-2025-8812', 850000.00, 25500.00, 0.00, 'Bank Wire Transfer (NEFT/RTGS)', '2025-11-09 18:30:00+05:30')
ON CONFLICT (id) DO NOTHING;

-- 22. CERTIFICATES
INSERT INTO certificates (id, customer_id, sale_id, certificate_authority, certificate_number, item_title, carat_weight, color_grade, clarity_grade, cut_grade, pdf_url, issued_date)
VALUES
('cert_rahul_01', 'cust_rahul_sharma', 'sale_rahul_01', 'GIA', 'GIA-2218903445', '2.01ct Round Brilliant Natural Diamond', 2.010, 'D', 'VVS1', 'Excellent', '/assets/certificates/gia_2218903445.pdf', '2025-10-12'),
('cert_ananya_01', 'cust_ananya_rao', NULL, 'GIA', 'GIA-5541098234', '1.50ct Twin Solitaire Diamonds', 1.500, 'E', 'VVS2', 'Excellent', '/assets/certificates/gia_5541098234.pdf', '2026-01-15')
ON CONFLICT (id) DO NOTHING;

-- 23. REPAIRS
INSERT INTO repairs (id, customer_id, item_description, issue_type, status, estimated_cost, actual_cost, promised_date, assigned_artisan_id, notes)
VALUES
('rep_rahul_01', 'cust_rahul_sharma', '2.01ct Platinum Solitaire Ring (SN-AUR-8812-BOM)', 'Prong Tightening & Rhodium Polish', 'in_atelier', 0.00, 0.00, '2026-08-05', 'user_artisan_01', 'Complimentary VIP annual maintenance. Micro-buffing platinum shank. Overdue by 3 days.')
ON CONFLICT (id) DO NOTHING;

-- 24. EXCHANGES
INSERT INTO exchanges (id, customer_id, original_item_description, original_value, trade_in_allowance, upgraded_item_sku, balance_payable, appraisal_notes, status)
VALUES
('exch_arjun_01', 'cust_arjun_mehta', '18K Yellow Gold Plain Band (Purchased 2023)', 120000.00, 115000.00, 'AUR-RNG-PLT-02', 385000.00, 'Gold purity tested 91.8% on XRF spectrometer. Full 100% exchange credit applied.', 'approved')
ON CONFLICT (id) DO NOTHING;

-- 25. INTERACTIONS (Multi-turn Omnichannel History)
INSERT INTO interactions (id, customer_id, journey_id, channel, direction, subject, summary, raw_content, sentiment, sentiment_score, intent, staff_id, timestamp)
VALUES
('int_rahul_01', 'cust_rahul_sharma', 'jour_rahul_ring', 'whatsapp', 'inbound', 'Repair Status Inquiry', 'Customer inquiring about delayed ring maintenance', 'Hello Aurum team, I dropped off my engagement ring for annual prong tightening ten days ago. The promised date was August 5th and I have not received any update. I need this for my upcoming trip this weekend. Where is my repaired ring?', 'frustrated', 0.15, 'repair_status_inquiry', 'user_service_agent_01', '2026-08-08 09:30:00+05:30'),
('int_rahul_02', 'cust_rahul_sharma', 'jour_rahul_ring', 'phone', 'inbound', 'Frustrated followup call', 'Customer expressed dissatisfaction regarding delayed communication', 'Called concierge desk. Spoke with Neha. Expressed frustration that no proactive communication was sent regarding workshop delay.', 'negative', 0.22, 'complaint_escalation', 'user_service_agent_01', '2026-08-08 10:15:00+05:30'),
('int_priya_01', 'cust_priya_reddy', 'jour_priya_bridal', 'whatsapp', 'inbound', 'Bridal Set Preview Inquiry', 'Customer excited to view master setting progress for emerald choker', 'Hi Kavita! Siddharth and I are visiting Mumbai next week. Can we schedule a private atelier trial of the emerald choker setting?', 'positive', 0.94, 'consultation_booking', 'user_sales_mgr_01', '2026-08-07 16:45:00+05:30')
ON CONFLICT (id) DO NOTHING;

-- 26. SERVICE TICKETS
INSERT INTO service_tickets (id, customer_id, ticket_number, subject, category, priority, status, assigned_agent_id, churn_indicator, sentiment, due_date)
VALUES
('tkt_rahul_01', 'cust_rahul_sharma', 'TCK-2026-8801', 'Urgent: Overdue Solitaire Ring Repair Status & Client Anxiety', 'Repair Status Inquiry', 'urgent', 'open', 'user_service_agent_01', 'high', 'frustrated', '2026-08-08 14:00:00+05:30'),
('tkt_priya_01', 'cust_priya_reddy', 'TCK-2026-8802', 'Private Atelier Viewing Booking: Royal Emerald Bridal Choker', 'Bespoke Customization', 'medium', 'in_progress', 'user_sales_mgr_01', 'low', 'positive', '2026-08-10 18:00:00+05:30'),
('tkt_ananya_01', 'cust_ananya_rao', 'TCK-2026-8803', 'Anniversary Diamond Band Catalog Request', 'Product Recommendation', 'low', 'resolved', 'user_service_agent_01', 'low', 'positive', '2026-08-04 12:00:00+05:30')
ON CONFLICT (id) DO NOTHING;

-- 27. CONVERSATIONS & MESSAGES
INSERT INTO conversations (id, ticket_id, customer_id, channel)
VALUES
('conv_rahul_01', 'tkt_rahul_01', 'cust_rahul_sharma', 'whatsapp')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_type, sender_id, message_text, is_ai_draft, is_approved)
VALUES
('msg_r_01', 'conv_rahul_01', 'customer', 'cust_rahul_sharma', 'Hello Aurum team, I dropped off my engagement ring for annual prong tightening ten days ago. The promised date was August 5th and I have not received any update. I need this for my upcoming trip this weekend. Where is my repaired ring?', FALSE, TRUE),
('msg_r_02', 'conv_rahul_01', 'ai', 'gemini-1.5-flash', 'Dear Mr. Sharma, We sincerely apologize for the delay on your 2.01ct Solitaire Ring (SN-AUR-8812). Our Master Goldsmith has completed the prong tightening and the piece is currently undergoing final quality inspection and ultrasonic polishing at our Mumbai Flagship Atelier. It will be hand-delivered to you by 4:00 PM tomorrow with complimentary insurance appraisal updates.', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 28. SEGMENTS
INSERT INTO segments (id, name, description, criteria, customer_count, created_by)
VALUES
('seg_vip_bridal', 'High-Net-Worth Bridal & Solitaire Patrons', 'Clients with lifetime value > ₹20L and active bespoke journeys', '{"tier": "VIP", "minSpend": 2000000}'::jsonb, 48, 'user_mktg_mgr_01'),
('seg_at_risk_repairs', 'At-Risk Clients with Active Repair Delays', 'Customers with overdue repair tickets and negative interaction sentiment', '{"hasOverdueRepair": true, "negativeSentiment": true}'::jsonb, 6, 'user_mktg_mgr_01'),
('seg_anniversary_q4', 'Q4 Wedding Anniversary VIPs', 'Patrons with wedding anniversaries falling between Oct and Dec', '{"anniversaryQuarter": "Q4"}'::jsonb, 24, 'user_mktg_mgr_01')
ON CONFLICT (id) DO NOTHING;

-- 29. CAMPAIGNS
INSERT INTO campaigns (id, name, segment_id, channel, status, scheduled_date, total_targeted, total_engaged, total_converted)
VALUES
('camp_diwali_solitaire', 'Royal Heritage Festive Preview 2026', 'seg_vip_bridal', 'whatsapp', 'active', '2026-09-15', 48, 38, 14),
('camp_anniversary_concierge', 'Bespoke Anniversary Eternity Band Outreach', 'seg_anniversary_q4', 'whatsapp', 'active', '2026-10-01', 24, 18, 9)
ON CONFLICT (id) DO NOTHING;

-- 30. MODEL VERSIONS
INSERT INTO model_versions (id, model_name, version_tag, provider, prompt_template, confidence_threshold, is_active)
VALUES
('mod_gemini_15_flash', 'Google Gemini 1.5 Flash', 'v1.5-flash-2026', 'Google Gemini', 'You are an elite luxury jewellery concierge AI. Synthesize customer journey stage, past tickets, preferences, and sentiment into evidence-based next best actions.', 0.75, TRUE),
('mod_gemini_15_pro', 'Google Gemini 1.5 Pro', 'v1.5-pro-enterprise', 'Google Gemini', 'Enterprise jewellery reasoning model with strict adherence to regulatory consent and frequency caps.', 0.80, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 31. AI RUNS
INSERT INTO ai_runs (id, model_version_id, task_type, input_snapshot, output_payload, latency_ms, confidence, status)
VALUES
('run_ai_01', 'mod_gemini_15_flash', 'nba', '{"customer_id": "cust_rahul_sharma", "ticket_id": "tkt_rahul_01", "intent": "repair_status_inquiry"}'::jsonb, '{"action": "Expedite repair in atelier and call customer with delivery confirmation", "confidence": 0.92, "evidence": ["Repair is 3 days overdue", "Customer expressed negative sentiment", "Upcoming travel deadline"]}'::jsonb, 420, 0.92, 'success'),
('run_ai_02', 'mod_gemini_15_flash', 'sentiment', '{"text": "I have been waiting ten days and received no update!"}'::jsonb, '{"sentiment": "frustrated", "score": 0.15, "confidence": 0.89}'::jsonb, 310, 0.89, 'success')
ON CONFLICT (id) DO NOTHING;

-- 32. RECOMMENDATIONS (AI Next Best Actions with Deterministic Governance)
INSERT INTO recommendations (id, customer_id, journey_id, ticket_id, recommendation_type, recommended_action, channel, confidence_score, explanation, evidence, model_version, status, consent_verified, eligibility_verified, frequency_verified)
VALUES
('rec_rahul_01', 'cust_rahul_sharma', 'jour_rahul_ring', 'tkt_rahul_01', 'repair_delay_concierge_outreach', 'Dispatch personal telephonic update from Senior Director Kavita Deshmukh confirming expedited delivery by 4 PM tomorrow with complimentary rhodium care kit.', 'whatsapp', 0.92, 'Customer has high churn risk (0.78) triggered by a 3-day overdue repair on high-value ring. Proactive high-touch concierge intervention will restore patron confidence.', '["Repair #rep_rahul_01 is 3 days overdue (Promised Aug 5)", "Customer expressed negative sentiment (0.15)", "Patron has ₹18.5L lifetime spend and upcoming anniversary in Nov", "Consent on WhatsApp is verified (1/3 messages used this week)"]'::jsonb, 'Google Gemini 1.5 Flash', 'pending_review', TRUE, TRUE, TRUE),
('rec_priya_01', 'cust_priya_reddy', 'jour_priya_bridal', 'tkt_priya_01', 'bespoke_atelier_invitation', 'Confirm private atelier viewing with Master Artisan Gopal Rao on August 14th with complimentary champagne pairing.', 'whatsapp', 0.95, 'Patron is ready for mid-production trial of ₹38L emerald choker.', '["Production stage 3 at 70% completion", "Customer requested in-person atelier trial", "Preferred channel WhatsApp is active (1/4 weekly frequency used)"]'::jsonb, 'Google Gemini 1.5 Flash', 'approved', TRUE, TRUE, TRUE),
('rec_ananya_01', 'cust_ananya_rao', 'jour_ananya_studs', NULL, 'anniversary_catalog_outreach', 'Send curated digital preview of Celeste Rose Gold Diamond Pendant for upcoming birthday.', 'email', 0.84, 'Customer birthday on Oct 5th; strong affinity for Rose Gold & Round Solitaires.', '["Customer opted out of WhatsApp, but consented to Email", "Frequency limit verified (1/3 sent this week)", "Lifetime value ₹12.5L in good standing"]'::jsonb, 'Google Gemini 1.5 Flash', 'pending_review', TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 33. APPROVALS
INSERT INTO approvals (id, recommendation_id, reviewer_id, decision, override_reason, previous_recommendation, final_action_taken, reviewed_at)
VALUES
('appr_priya_01', 'rec_priya_01', 'user_sales_mgr_01', 'approved', NULL, 'Confirm private atelier viewing with Master Artisan Gopal Rao on August 14th', 'Sent personalized WhatsApp confirmation with private calendar invite for August 14th at 4:00 PM', '2026-08-08 08:30:00+05:30')
ON CONFLICT (id) DO NOTHING;

-- 34. OUTCOMES (Model Feedback Loop)
INSERT INTO outcomes (id, recommendation_id, approval_id, customer_response, conversion_value, feedback_score, feedback_notes)
VALUES
('outc_priya_01', 'rec_priya_01', 'appr_priya_01', 'converted', 3800000.00, 'helpful', 'Customer confirmed appointment within 15 minutes. Very pleased with prompt concierge response.')
ON CONFLICT (id) DO NOTHING;

-- 35. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, notification_type, is_read, urgency, link_url)
VALUES
('notif_01', 'user_sales_mgr_01', 'Urgent AI Recommendation Pending: Rahul Sharma', 'AI generated high-priority outreach for overdue repair status on VIP ring.', 'ai_approval_needed', FALSE, 'urgent', '/tickets'),
('notif_02', 'user_service_agent_01', 'New Ticket Assigned: TCK-2026-8801', 'Urgent repair status inquiry assigned by system from WhatsApp channel.', 'ticket_assigned', FALSE, 'urgent', '/tickets'),
('notif_03', 'user_sales_mgr_01', 'Journey Milestone Completed: Priya Reddy', 'Design & Sourcing completed for Imperial Emerald Choker. Production underway.', 'journey_update', TRUE, 'normal', '/journeys'),
('notif_04', 'user_admin_01', 'System Audit Alert: High-Value Override', 'Sales Manager approved custom diamond credit adjustment for Arjun Mehta.', 'system', FALSE, 'normal', '/audit-logs')
ON CONFLICT (id) DO NOTHING;

-- 36. AUDIT LOGS (Immutable Security & Governance Trail)
INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, previous_value, new_value, reason, ip_address)
VALUES
('aud_01', 'user_sales_mgr_01', 'Kavita Deshmukh', 'sales_manager', 'LOGIN', 'auth', 'user_sales_mgr_01', NULL, '{"status": "success", "method": "password_jwt"}'::jsonb, 'Standard authenticated session login', '192.168.1.104'),
('aud_02', 'user_sales_mgr_01', 'Kavita Deshmukh', 'sales_manager', 'APPROVE_RECOMMENDATION', 'recommendation', 'rec_priya_01', '{"status": "pending_review"}'::jsonb, '{"status": "approved", "channel": "whatsapp"}'::jsonb, 'Client requested appointment. Recommendation matches VIP guidelines.', '192.168.1.104'),
('aud_03', 'user_service_agent_01', 'Neha Kapoor', 'service_agent', 'AI_EXECUTION', 'ai_run', 'run_ai_01', NULL, '{"task": "nba", "customer": "cust_rahul_sharma", "confidence": 0.92}'::jsonb, 'Automated Next Best Action generation for overdue ticket', '192.168.1.112'),
('aud_04', 'user_sales_mgr_01', 'Kavita Deshmukh', 'sales_manager', 'OVERRIDE_RECOMMENDATION', 'recommendation', 'rec_legacy_01', '{"discount": 0.05}'::jsonb, '{"discount": 0.08, "reason": "Director discretionary loyalty allowance"}'::jsonb, 'Client has exceeded ₹50L lifetime threshold, authorized additional 3% diamond valuation credit.', '192.168.1.104'),
('aud_05', 'user_admin_01', 'Aarav Singhal', 'admin', 'SYSTEM_SETTING_CHANGE', 'configuration', 'cfg_ai_threshold', '{"threshold": 0.70}'::jsonb, '{"threshold": 0.75}'::jsonb, 'Increased minimum AI confidence threshold for automated recommendation queueing', '192.168.1.100')
ON CONFLICT (id) DO NOTHING;

-- 37. CONFIGURATION
INSERT INTO configuration (id, config_key, config_value, description, updated_by_id)
VALUES
('cfg_01', 'ai_confidence_threshold', '{"min_confidence": 0.75, "require_human_approval": true}'::jsonb, 'Minimum Gemini confidence score required before queuing recommendation', 'user_admin_01'),
('cfg_02', 'weekly_frequency_cap_default', '{"whatsapp": 3, "email": 2, "sms": 1}'::jsonb, 'Default maximum outbound messages per customer per week', 'user_admin_01'),
('cfg_03', 'high_churn_threshold', '{"churn_risk_cutoff": 0.65}'::jsonb, 'Threshold at which a customer is flagged as at-risk requiring immediate concierge escalation', 'user_admin_01')
ON CONFLICT (id) DO NOTHING;
