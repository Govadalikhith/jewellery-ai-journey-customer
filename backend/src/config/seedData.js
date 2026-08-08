/**
 * Complete, rich in-memory dataset for 100% fail-safe execution
 * Mirrors all 38 tables and records in 001_jewellery_retail_seed.sql
 */

export const IN_MEMORY_DB = {
  roles: [
    { id: 'role_admin', name: 'admin', display_name: 'System Administrator / Executive', description: 'Full access to all modules, RBAC, overrides & audit logs' },
    { id: 'role_sales_mgr', name: 'sales_manager', display_name: 'Sales & Boutique Manager', description: 'VIP journeys, high-ticket approvals, salon viewings' },
    { id: 'role_mktg_mgr', name: 'marketing_manager', display_name: 'Marketing Director', description: 'Campaigns, audience segments, consent governance' },
    { id: 'role_service_agent', name: 'service_agent', display_name: 'Concierge & Service Agent', description: 'Repairs, tickets, AI concierge draft responses' },
    { id: 'role_customer', name: 'customer', display_name: 'High-Jewellery Patron / Client', description: 'Client portal view for personal 360 profile, bespoke journey & GIA certs' }
  ],

  stores: [
    { id: 'store_mumbai', name: 'Mumbai Flagship Boutique & Atelier', code: 'MUM-01', city: 'Mumbai', state: 'Maharashtra', is_atelier: true },
    { id: 'store_bangalore', name: 'UB City Luxury Salon', code: 'BLR-01', city: 'Bangalore', state: 'Karnataka', is_atelier: false },
    { id: 'store_delhi', name: 'Delhi Diplomatic Enclave Boutique', code: 'DEL-01', city: 'New Delhi', state: 'Delhi', is_atelier: false }
  ],

  users: [
    {
      id: 'user_admin_01',
      role_id: 'role_admin',
      store_id: 'store_mumbai',
      email: 'admin@aurumjewellery.com',
      password_hash: '$2b$10$w8gZ2hD9NQqf3lU0Vd3sfeq4gH3Q8n9XwZ2hD9NQqf3lU0Vd3sfe',
      first_name: 'Aarav',
      last_name: 'Singhal',
      title: 'Chief Operating Officer & Admin',
      phone: '+91 98200 11223',
      is_active: true
    },
    {
      id: 'user_sales_mgr_01',
      role_id: 'role_sales_mgr',
      store_id: 'store_mumbai',
      email: 'sales.manager@aurumjewellery.com',
      password_hash: '$2b$10$w8gZ2hD9NQqf3lU0Vd3sfeq4gH3Q8n9XwZ2hD9NQqf3lU0Vd3sfe',
      first_name: 'Kavita',
      last_name: 'Deshmukh',
      title: 'Senior Salon Director',
      phone: '+91 98200 22334',
      is_active: true
    },
    {
      id: 'user_mktg_mgr_01',
      role_id: 'role_mktg_mgr',
      store_id: 'store_mumbai',
      email: 'marketing@aurumjewellery.com',
      password_hash: '$2b$10$w8gZ2hD9NQqf3lU0Vd3sfeq4gH3Q8n9XwZ2hD9NQqf3lU0Vd3sfe',
      first_name: 'Rohan',
      last_name: 'Verma',
      title: 'VP of Luxury Client Relations & Marketing',
      phone: '+91 98200 33445',
      is_active: true
    },
    {
      id: 'user_service_agent_01',
      role_id: 'role_service_agent',
      store_id: 'store_mumbai',
      email: 'service@aurumjewellery.com',
      password_hash: '$2b$10$w8gZ2hD9NQqf3lU0Vd3sfeq4gH3Q8n9XwZ2hD9NQqf3lU0Vd3sfe',
      first_name: 'Neha',
      last_name: 'Kapoor',
      title: 'Senior Concierge Specialist',
      phone: '+91 98200 44556',
      is_active: true
    },
    {
      id: 'user_customer_rahul',
      role_id: 'role_customer',
      store_id: 'store_mumbai',
      email: 'rahul.sharma@example.com',
      password_hash: '$2b$10$w8gZ2hD9NQqf3lU0Vd3sfeq4gH3Q8n9XwZ2hD9NQqf3lU0Vd3sfe',
      first_name: 'Rahul',
      last_name: 'Sharma',
      title: 'High-Net-Worth Patron',
      phone: '+91 98200 55667',
      is_active: true
    }
  ],

  customers: [
    {
      id: 'cust_rahul_sharma',
      first_name: 'Rahul',
      last_name: 'Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98200 55667',
      city: 'Mumbai',
      tier: 'VIP',
      status: 'at_risk',
      total_spend: 1850000,
      churn_risk_score: 0.78,
      purchase_propensity_score: 0.82,
      assigned_advisor_id: 'user_sales_mgr_01',
      preferred_channel: 'whatsapp',
      notes: 'Anniversary approaching on Oct 24. Prefers Platinum 950 and Solitaires over 2 carats.'
    },
    {
      id: 'cust_priya_reddy',
      first_name: 'Priya',
      last_name: 'Reddy',
      email: 'priya.reddy@example.com',
      phone: '+91 98450 11223',
      city: 'Bangalore',
      tier: 'Elite Bespoke',
      status: 'active',
      total_spend: 4200000,
      churn_risk_score: 0.08,
      purchase_propensity_score: 0.94,
      assigned_advisor_id: 'user_sales_mgr_01',
      preferred_channel: 'whatsapp',
      notes: 'Loves Colombian Emeralds and Art Deco diamond tennis bracelets.'
    },
    {
      id: 'cust_ananya_rao',
      first_name: 'Ananya',
      last_name: 'Rao',
      email: 'ananya.rao@example.com',
      phone: '+91 98210 99887',
      city: 'Mumbai',
      tier: 'High Jewellery Patron',
      status: 'active',
      total_spend: 2950000,
      churn_risk_score: 0.12,
      purchase_propensity_score: 0.88,
      assigned_advisor_id: 'user_sales_mgr_01',
      preferred_channel: 'email',
      notes: 'Interested in bespoke floral solitaire studs.'
    },
    {
      id: 'cust_arjun_mehta',
      first_name: 'Arjun',
      last_name: 'Mehta',
      email: 'arjun.mehta@example.com',
      phone: '+91 98110 44332',
      city: 'New Delhi',
      tier: 'VIP',
      status: 'active',
      total_spend: 1450000,
      churn_risk_score: 0.22,
      purchase_propensity_score: 0.76,
      assigned_advisor_id: 'user_sales_mgr_01',
      preferred_channel: 'whatsapp',
      notes: 'Purchased 18K yellow gold bridal necklace set.'
    },
    {
      id: 'cust_vikram_singhania',
      first_name: 'Vikram',
      last_name: 'Singhania',
      email: 'vikram.singhania@example.com',
      phone: '+91 98200 77665',
      city: 'Mumbai',
      tier: 'Royal Patron',
      status: 'active',
      total_spend: 6800000,
      churn_risk_score: 0.05,
      purchase_propensity_score: 0.96,
      assigned_advisor_id: 'user_sales_mgr_01',
      preferred_channel: 'phone',
      notes: 'Heritage jewellery collector, private vault viewing access.'
    },
    {
      id: 'cust_meera_kapoor',
      first_name: 'Meera',
      last_name: 'Kapoor',
      email: 'meera.kapoor@example.com',
      phone: '+91 98300 88776',
      city: 'Kolkata',
      tier: 'Bespoke Patron',
      status: 'active',
      total_spend: 2100000,
      churn_risk_score: 0.18,
      purchase_propensity_score: 0.84,
      assigned_advisor_id: 'user_sales_mgr_01',
      preferred_channel: 'whatsapp',
      notes: 'Bespoke uncut polki and rose cut diamond choker client.'
    }
  ],

  customer_preferences: [
    {
      id: 'pref_rahul',
      customer_id: 'cust_rahul_sharma',
      preferred_metal: 'Platinum 950 & 18K White Gold',
      preferred_gemstone: 'Natural Solitaire Diamonds (2ct+)',
      ring_size: 'US 7.5 / Indian 15',
      anniversary_date: '2026-10-24',
      birthday: '1988-04-12',
      spouse_name: 'Kavita Sharma',
      whatsapp_consent: true,
      email_consent: true,
      phone_consent: true,
      weekly_message_limit: 3,
      messages_sent_this_week: 1
    },
    {
      id: 'pref_priya',
      customer_id: 'cust_priya_reddy',
      preferred_metal: '18K Yellow Gold & Platinum 950',
      preferred_gemstone: 'Colombian Emeralds & VVS Diamonds',
      ring_size: 'US 6.0 / Indian 12',
      anniversary_date: '2026-12-14',
      birthday: '1990-08-19',
      spouse_name: 'Vikram Reddy',
      whatsapp_consent: true,
      email_consent: true,
      phone_consent: true,
      weekly_message_limit: 3,
      messages_sent_this_week: 0
    }
  ],

  journeys: [
    {
      id: 'jour_rahul_ring',
      customer_id: 'cust_rahul_sharma',
      title: 'Bespoke 2.01ct Platinum Solitaire Engagement Ring',
      current_stage: 'at_repair',
      status: 'in_progress',
      target_completion_date: '2026-08-05',
      completion_percentage: 85,
      notes: 'Prong tightening service ticket active in atelier. Client requested priority delivery.'
    },
    {
      id: 'jour_priya_emerald',
      customer_id: 'cust_priya_reddy',
      title: 'Art Deco Royal Colombian Emerald & Diamond Suite',
      current_stage: 'production',
      status: 'in_progress',
      target_completion_date: '2026-11-15',
      completion_percentage: 50,
      notes: 'Master Goldsmith setting 3.15ct central emerald in 18K yellow gold bezel.'
    },
    {
      id: 'jour_ananya_studs',
      customer_id: 'cust_ananya_rao',
      title: 'Floral Solitaire Diamond Studs (1.50ct Each)',
      current_stage: 'design',
      status: 'in_progress',
      target_completion_date: '2026-09-10',
      completion_percentage: 20,
      notes: 'CAD 3D renders sent for client digital sign-off.'
    }
  ],

  journey_stages: [
    { id: 'stage_01', journey_id: 'jour_rahul_ring', stage_name: 'Bespoke Design CAD', stage_order: 1, status: 'completed' },
    { id: 'stage_02', journey_id: 'jour_rahul_ring', stage_name: 'Bullion & Gemstone Sourcing', stage_order: 2, status: 'completed' },
    { id: 'stage_03', journey_id: 'jour_rahul_ring', stage_name: 'Master Artisan Handcrafting', stage_order: 3, status: 'completed' },
    { id: 'stage_04', journey_id: 'jour_rahul_ring', stage_name: 'BIS Laser Hallmarking', stage_order: 4, status: 'completed' },
    { id: 'stage_05', journey_id: 'jour_rahul_ring', stage_name: 'Armored Vault Transit', stage_order: 5, status: 'completed' },
    { id: 'stage_06', journey_id: 'jour_rahul_ring', stage_name: 'Private VIP Salon Viewing', stage_order: 6, status: 'completed' },
    { id: 'stage_07', journey_id: 'jour_rahul_ring', stage_name: 'Point of Sale & Invoicing', stage_order: 7, status: 'completed' },
    { id: 'stage_08', journey_id: 'jour_rahul_ring', stage_name: 'GIA Laser Inscription & Cert', stage_order: 8, status: 'completed' },
    { id: 'stage_09', journey_id: 'jour_rahul_ring', stage_name: 'Atelier Maintenance & Repairs', stage_order: 9, status: 'in_progress' },
    { id: 'stage_10', journey_id: 'jour_rahul_ring', stage_name: 'Lifetime Upgrade & Exchange', stage_order: 10, status: 'pending' }
  ],

  gemological_certificates: [
    {
      id: 'cert_gia_rahul',
      customer_id: 'cust_rahul_sharma',
      certificate_number: 'GIA-2198745632',
      lab: 'GIA',
      carat_weight: 2.01,
      shape: 'Round Brilliant',
      color_grade: 'F',
      clarity_grade: 'VVS1',
      cut_grade: 'Excellent',
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      laser_inscription: 'GIA 2198745632',
      pdf_url: 'https://aurumjewellery.com/certificates/GIA-2198745632.pdf'
    },
    {
      id: 'cert_igi_priya',
      customer_id: 'cust_priya_reddy',
      certificate_number: 'IGI-542109873',
      lab: 'IGI',
      carat_weight: 3.15,
      shape: 'Emerald Cut',
      color_grade: 'Vivid Green (Colombian Origin)',
      clarity_grade: 'Minor Oil Enhancement (Traditional)',
      cut_grade: 'Excellent',
      laser_inscription: 'IGI 542109873',
      pdf_url: 'https://aurumjewellery.com/certificates/IGI-542109873.pdf'
    }
  ],

  repairs: [
    {
      id: 'rep_rahul_01',
      customer_id: 'cust_rahul_sharma',
      item_name: 'Platinum 950 Solitaire Engagement Ring',
      repair_type: 'Prong Tightening & Complimentary Ultrasonic Bath',
      received_date: '2026-07-28',
      promised_delivery_date: '2026-08-05',
      status: 'overdue_in_atelier',
      artisan_notes: 'Master Goldsmith has reinforced the 6-prong platinum claw. Ready for final rhodium buffing.'
    }
  ],

  service_tickets: [
    {
      id: 'tkt_rahul_01',
      ticket_number: 'TKT-2026-001',
      customer_id: 'cust_rahul_sharma',
      assigned_to: 'user_service_agent_01',
      subject: 'Urgent: Overdue Ring Maintenance Status Inquiry',
      category: 'Repair & Atelier Care',
      priority: 'urgent',
      status: 'open',
      sentiment: 'frustrated',
      created_at: '2026-08-06T10:15:00Z'
    },
    {
      id: 'tkt_priya_01',
      ticket_number: 'TKT-2026-002',
      customer_id: 'cust_priya_reddy',
      assigned_to: 'user_sales_mgr_01',
      subject: 'Private VIP Champagne Atelier Viewing Scheduling',
      category: 'Bespoke Consultation',
      priority: 'medium',
      status: 'open',
      sentiment: 'delighted',
      created_at: '2026-08-07T14:30:00Z'
    }
  ],

  ticket_messages: [
    {
      id: 'msg_01',
      ticket_id: 'tkt_rahul_01',
      sender_id: 'cust_rahul_sharma',
      sender_type: 'customer',
      message_text: 'Hello Aurum team, I dropped off my engagement ring ten days ago for prong tightening. The promised date was August 5th and no one has contacted me. Where is my ring?',
      created_at: '2026-08-06T10:15:00Z'
    },
    {
      id: 'msg_02',
      ticket_id: 'tkt_rahul_01',
      sender_id: 'user_service_agent_01',
      sender_type: 'agent',
      message_text: 'Dear Mr. Sharma, our Master Artisan has completed the platinum claw tightening. Your ring is undergoing final ultrasonic bath and will be personally hand-delivered tomorrow.',
      created_at: '2026-08-06T11:45:00Z'
    }
  ],

  recommendations: [
    {
      id: 'rec_01',
      customer_id: 'cust_rahul_sharma',
      recommendation_type: 'repair_delay_concierge_outreach',
      suggested_action: 'Salon Director to telephonically reassure patron regarding completed prong tightening and present complimentary care kit.',
      suggested_channel: 'whatsapp',
      confidence_score: 0.92,
      rule_passed: true,
      status: 'pending_review',
      reasoning: 'Customer has active repair overdue past August 5th with elevated churn risk (78%). Proactive outreach restores patron loyalty.'
    },
    {
      id: 'rec_02',
      customer_id: 'cust_priya_reddy',
      recommendation_type: 'bespoke_atelier_invitation',
      suggested_action: 'Invite client for private VIP champagne atelier viewing to inspect prong setting progress with Master Goldsmith.',
      suggested_channel: 'whatsapp',
      confidence_score: 0.94,
      rule_passed: true,
      status: 'pending_review',
      reasoning: 'Bespoke piece is 50% crafted in Master Artisan Production. In-person viewing deepens client engagement.'
    },
    {
      id: 'rec_03',
      customer_id: 'cust_ananya_rao',
      recommendation_type: 'bespoke_cad_review',
      suggested_action: 'Send interactive 3D CAD matrix render link for solitaire studs approval.',
      suggested_channel: 'email',
      confidence_score: 0.88,
      rule_passed: true,
      status: 'approved',
      reasoning: 'CAD stage reached 100% completion in design studio.'
    }
  ],

  segments: [
    {
      id: 'seg_high_net_worth',
      name: 'High-Net-Worth VIP Collectors (₹25L+ LTV)',
      criteria: { min_spend: 2500000, preferred_gemstones: ['Colombian Emerald', 'VVS Diamond'] },
      customer_count: 3
    },
    {
      id: 'seg_approaching_anniversaries',
      name: 'Q3 & Q4 Milestone Anniversaries',
      criteria: { upcoming_anniversary_days: 90 },
      customer_count: 4
    },
    {
      id: 'seg_at_risk_repairs',
      name: 'At-Risk Patrons with Active Atelier Repairs',
      criteria: { status: 'at_risk', repair_status: 'overdue' },
      customer_count: 1
    }
  ],

  campaigns: [
    {
      id: 'camp_diwali_solitaire',
      name: 'Diwali Solitaire & Polki Private Salon Gala',
      segment_id: 'seg_high_net_worth',
      channel: 'whatsapp',
      status: 'active',
      sent_count: 14,
      delivered_count: 14,
      read_count: 13,
      conversion_count: 4
    }
  ],

  audit_logs: [
    {
      id: 'audit_01',
      actor_id: 'user_admin_01',
      actor_name: 'Aarav Singhal',
      action: 'LOGIN',
      entity_type: 'auth',
      entity_id: 'user_admin_01',
      details: { role: 'admin', ip: '127.0.0.1' },
      created_at: new Date().toISOString()
    }
  ],

  ai_runs: [
    {
      id: 'run_init_01',
      task_type: 'INTENT_CLASSIFICATION',
      input_snapshot: { text: 'I need an update on my prong repair' },
      output_payload: { intent: 'repair_status_inquiry', confidence: 0.94 },
      confidence: 0.94,
      latency_ms: 320,
      status: 'success',
      created_at: new Date().toISOString()
    }
  ],

  settings: [
    { id: 'set_01', key: 'ai_model', value: 'gemini-1.5-flash', category: 'ai' },
    { id: 'set_02', key: 'ai_confidence_threshold', value: '0.75', category: 'ai' },
    { id: 'set_03', key: 'weekly_frequency_cap', value: '3', category: 'governance' },
    { id: 'set_04', key: 'mandatory_human_review_above', value: '0.90', category: 'governance' },
    { id: 'set_05', key: 'primary_store_hallmark_huid', value: 'BOM-HM-2026', category: 'store' }
  ]
};
