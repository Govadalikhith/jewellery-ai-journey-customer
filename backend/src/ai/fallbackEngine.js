/**
 * Heuristic & Rule-Based AI Fallback Engine
 * Provides deterministic, structured jewellery intelligence outputs.
 */

export const FallbackEngine = {
  classifyIntent(text = '') {
    const lower = text.toLowerCase();
    if (lower.includes('repair') || lower.includes('polish') || lower.includes('prong') || lower.includes('resize') || lower.includes('tightening')) {
      return {
        intent: 'repair_status_inquiry',
        confidence: 0.94,
        explanation: 'Customer mentions repair, polishing, prong tightening or maintenance terms.',
        keyEntities: ['repair_atelier', 'prong_tightening', 'ring_maintenance']
      };
    }
    if (lower.includes('bespoke') || lower.includes('cad') || lower.includes('design') || lower.includes('custom') || lower.includes('render')) {
      return {
        intent: 'bespoke_customization',
        confidence: 0.92,
        explanation: 'Inquiry involves bespoke customization, CAD 3D renders, or master crafting.',
        keyEntities: ['cad_rendering', 'bespoke_design', 'custom_casting']
      };
    }
    if (lower.includes('appoint') || lower.includes('visit') || lower.includes('salon') || lower.includes('view') || lower.includes('trial')) {
      return {
        intent: 'consultation_booking',
        confidence: 0.91,
        explanation: 'Client is requesting an in-person VIP salon viewing or trial appointment.',
        keyEntities: ['vip_salon_appointment', 'champagne_viewing']
      };
    }
    if (lower.includes('exchange') || lower.includes('upgrade') || lower.includes('trade-in') || lower.includes('old gold')) {
      return {
        intent: 'appraisal_exchange',
        confidence: 0.89,
        explanation: 'Customer inquiring about lifetime exchange, gold rate buy-back, or diamond upgrade.',
        keyEntities: ['lifetime_exchange', 'upgrade_credit']
      };
    }
    return {
      intent: 'general_concierge_inquiry',
      confidence: 0.82,
      explanation: 'General luxury hospitality and product portfolio inquiry.',
      keyEntities: ['concierge_service', 'jewellery_care']
    };
  },

  analyzeSentiment(text = '') {
    const lower = text.toLowerCase();
    if (lower.includes('waiting') || lower.includes('delay') || lower.includes('frustrat') || lower.includes('angry') || lower.includes('no update') || lower.includes('urgent') || lower.includes('terrible')) {
      return {
        sentiment: 'frustrated',
        score: 0.15,
        confidence: 0.91,
        explanation: 'Negative emotional markers detected relating to overdue timelines and communication gaps.',
        emotionalMarkers: ['urgency', 'impatience', 'service_delay_anxiety']
      };
    }
    if (lower.includes('thrill') || lower.includes('love') || lower.includes('exceed') || lower.includes('beautiful') || lower.includes('stunning') || lower.includes('excited') || lower.includes('thank')) {
      return {
        sentiment: 'positive',
        score: 0.95,
        confidence: 0.94,
        explanation: 'Client expressed high delight, appreciation, and excitement.',
        emotionalMarkers: ['delight', 'high_satisfaction', 'brand_affinity']
      };
    }
    return {
      sentiment: 'neutral',
      score: 0.65,
      confidence: 0.85,
      explanation: 'Tone is standard professional and informational without pronounced emotional polarity.',
      emotionalMarkers: ['matter_of_fact', 'inquiry_focused']
    };
  },

  summarizeConversation(ticketSubject = '', messages = []) {
    const messageCount = messages.length;
    const latestMsg = messages.length > 0 ? messages[messages.length - 1].message_text : '';
    return {
      summary: `Customer opened ticket regarding "${ticketSubject}". Multi-turn history spans ${messageCount} touchpoints. Latest communication indicates active status check requiring timely concierge followup.`,
      urgency: ticketSubject.toLowerCase().includes('urgent') || latestMsg.toLowerCase().includes('wait') ? 'urgent' : 'medium',
      keyMilestones: ['Ticket Logged', 'AI Draft Generated', 'Concierge Review Queued']
    };
  },

  draftResponse({ customerName = 'Patron', ticketCategory = 'Inquiry', detail = '' }) {
    let draft = `Dear ${customerName},\n\nThank you for reaching out to the Aurum & Co. Concierge Desk. Regarding your inquiry on ${ticketCategory.toLowerCase()}, our Master Artisan and Salon Director are actively monitoring your request.\n\nWe are committed to delivering the highest level of craftsmanship and personalized attention to your fine jewellery. You will receive an official update with timeline confirmation shortly.\n\nWarmest regards,\nAurum & Co. VIP Concierge Team`;

    if (ticketCategory.toLowerCase().includes('repair')) {
      draft = `Dear ${customerName},\n\nWe sincerely apologize for the delay regarding your fine jewellery maintenance. Your piece has successfully completed its workshop inspection and is currently undergoing final quality assay and ultrasonic rhodium buffing at our flagship atelier.\n\nOur Senior Director will personally ensure your jewellery is ready for hand-delivery or boutique collection tomorrow with complimentary insurance appraisal updates.\n\nWarmest regards,\nAurum & Co. Atelier Concierge`;
    }

    return {
      draftResponse: draft,
      channel: 'whatsapp',
      tone: 'luxury_concierge',
      suggestedNextStep: 'Verify atelier completion status and telephone customer prior to delivery dispatch.'
    };
  },

  predictChurnAndPropensity(customer = {}) {
    let churnScore = 0.15;
    let propensityScore = 0.80;

    if (customer.status === 'at_risk' || (customer.churn_risk_score && customer.churn_risk_score > 0.5)) {
      churnScore = 0.78;
      propensityScore = 0.65;
    }
    if (customer.tier === 'VIP' || customer.tier === 'Elite Bespoke') {
      propensityScore = Math.max(propensityScore, 0.92);
    }
    if (customer.total_spend > 2000000) {
      propensityScore = Math.max(propensityScore, 0.95);
    }

    return {
      churnScore,
      propensityScore,
      churnLabel: churnScore > 0.6 ? 'High Risk' : churnScore > 0.3 ? 'Moderate' : 'Low Risk',
      propensityLabel: propensityScore > 0.85 ? 'High Conversion Potential' : 'Moderate Potential'
    };
  },

  generateNextBestAction(customer = {}, journey = {}, openTickets = []) {
    if (openTickets.some(t => t.priority === 'urgent' || t.category.includes('Repair'))) {
      return {
        recommendationType: 'repair_delay_concierge_outreach',
        recommendedAction: `Personal telephonic consultation from Salon Director to reassure client on expedited repair delivery and present complimentary care kit.`,
        channel: 'whatsapp',
        confidence: 0.92,
        explanation: 'Customer has active repair ticket with high churn risk. Proactive outreach restores patron loyalty.',
        evidence: [
          'Repair milestone is near/past promised date',
          'Customer churn indicator is elevated (High)',
          'Client has verified WhatsApp consent (1/3 weekly messages utilized)'
        ]
      };
    }

    if (journey.current_stage === 'production') {
      return {
        recommendationType: 'bespoke_atelier_invitation',
        recommendedAction: `Invite client for private VIP champagne atelier viewing to inspect prong setting progress with Master Goldsmith.`,
        channel: 'whatsapp',
        confidence: 0.94,
        explanation: 'Bespoke piece is 70% crafted. In-person viewing deepens client engagement.',
        evidence: [
          'Journey stage is active in Master Artisan Production',
          'Client is enrolled in Elite Bespoke Tier',
          'WhatsApp channel frequency is within permissible limit'
        ]
      };
    }

    return {
      recommendationType: 'anniversary_catalog_outreach',
      recommendedAction: `Send curated digital dossier of matching diamond eternity bands for client anniversary.`,
      channel: 'email',
      confidence: 0.85,
      explanation: 'Customer preference indicates approaching milestone anniversary.',
      evidence: [
        'Customer preferences list upcoming anniversary',
        'Email marketing consent is verified',
        'Customer purchase propensity is 85%'
      ]
    };
  },

  answerCustomerQuery(queryText = '', dbContext = {}) {
    const q = queryText.toLowerCase();

    // 1. Rahul Sharma Inquiries
    if (q.includes('rahul') || q.includes('sharma')) {
      return {
        answer: `Rahul Sharma is a Tier 1 VIP patron with ₹18,50,000 lifetime spend. He has an active bespoke commission for a Platinum 950 Solitaire Engagement Ring (Round Brilliant Cut, GIA-2198745632, 2.01ct, F Color, VVS1 Clarity, Triple Excellent). He currently has an active service ticket (TKT-2026-001) regarding a delayed prong tightening in the atelier (promised delivery August 5th). His churn risk is currently elevated at 78% (At Risk), requiring proactive Salon Director telephonic reassurance.`,
        category: 'customer_status',
        confidence: 0.96,
        relevantRecords: ['cust_rahul_sharma', 'TKT-2026-001', 'GIA-2198745632', 'Platinum 950'],
        recommendedAction: 'Salon Director to contact Rahul via WhatsApp/Phone with complimentary ultrasonic polish update.'
      };
    }

    // 2. Priya Reddy Inquiries
    if (q.includes('priya') || q.includes('reddy') || q.includes('emerald')) {
      return {
        answer: `Priya Reddy is an Elite Bespoke patron with ₹42,00,000 lifetime spend (LTV ₹65L). Her preferred metal is Platinum 950 and 18K Yellow Gold with Colombian Emeralds. She is currently in Stage 3 (Master Artisan Handcrafting) for a 3.15ct Royal Colombian Emerald Necklace (BIS Hallmark: BOM-HM-2026-091). Her anniversary is approaching on Dec 14 with spouse Vikram Reddy. Churn risk is low (8%) and propensity is very high (94%).`,
        category: 'bespoke_crafting',
        confidence: 0.95,
        relevantRecords: ['cust_priya_reddy', 'BOM-HM-2026-091', 'Platinum 950', 'Colombian Emerald'],
        recommendedAction: 'Invite Priya for private VIP champagne atelier viewing to inspect prong setting progress.'
      };
    }

    // 3. GIA Certificate & 4Cs
    if (q.includes('gia') || q.includes('certificate') || q.includes('4cs') || q.includes('clarity') || q.includes('carat')) {
      return {
        answer: `Aurum & Co. issues full gemological certificates from GIA (Gemological Institute of America) and IGI for all natural solitaires. For example, Certificate GIA-2198745632 verifies a 2.01 Carat Round Brilliant Diamond, Color Grade F (Colorless), Clarity VVS1 (Very Very Slightly Included), Cut Grade Excellent, Polish & Symmetry Excellent, with zero fluorescence and laser inscribed girdle matching the registry.`,
        category: 'diamond_specifications',
        confidence: 0.98,
        relevantRecords: ['GIA-2198745632', 'IGI-542109873', 'Laser Inscription Girdle'],
        recommendedAction: 'Digital certificate dossier and 3D plotting chart can be exported directly from the Customer 360 profile.'
      };
    }

    // 4. BIS Hallmarking & Gold Purity
    if (q.includes('hallmark') || q.includes('bis') || q.includes('purity') || q.includes('22k') || q.includes('18k') || q.includes('916') || q.includes('750')) {
      return {
        answer: `All gold and platinum creations undergo mandatory BIS (Bureau of Indian Standards) Laser Assay Hallmarking at our certified Mumbai Assay Office. 22K gold bears the BIS 916 mark (91.6% pure gold), 18K gold bears the BIS 750 mark (75.0% pure gold), and 950 Platinum bears the PT950 laser hallmark along with our Aurum atelier identification crest and 6-digit alphanumeric HUID (Hallmark Unique Identification).`,
        category: 'hallmarking_compliance',
        confidence: 0.97,
        relevantRecords: ['BIS-916', 'BIS-750', 'PT-950', 'HUID Laser Assay'],
        recommendedAction: 'Assay certificates are permanently linked to the 10-stage journey timeline in Stage 4 (Hallmarking).'
      };
    }

    // 5. Atelier Repairs & Maintenance
    if (q.includes('repair') || q.includes('clean') || q.includes('prong') || q.includes('polishing') || q.includes('rhodium')) {
      return {
        answer: `Aurum & Co. provides lifetime complimentary ultrasonic cleaning, rhodium plating, and prong inspection for all bespoke pieces. Repairs are executed by Master Goldsmiths in our Mumbai atelier. Typical turnaround for prong tightening is 3–5 business days, and complete shank resizing is 7 business days, accompanied by a post-service insurance valuation appraisal.`,
        category: 'atelier_repairs',
        confidence: 0.94,
        relevantRecords: ['Atelier Care Desk', 'Complimentary Ultrasonic Bath', 'Rhodium Plating'],
        recommendedAction: 'View active repairs under the "Atelier Repairs" tab in the Customer 360 profile.'
      };
    }

    // 6. Lifetime Exchange & Buy-Back
    if (q.includes('exchange') || q.includes('buyback') || q.includes('upgrade') || q.includes('trade-in') || q.includes('gold rate')) {
      return {
        answer: `Aurum & Co. offers a 100% lifetime exchange policy on natural solitaire diamonds against current market benchmark value, and 100% gold exchange based on prevailing net bullion weight at 22K/18K rates with zero deductions on gross weight. Patrons can seamlessly upgrade carats or design settings at any flagship salon.`,
        category: 'lifetime_exchange',
        confidence: 0.95,
        relevantRecords: ['100% Solitaire Diamond Upgrade', 'Net Bullion Exchange Guarantee'],
        recommendedAction: 'Initiate trade-in valuation in Stage 10 (Lifetime Upgrade & Exchange) on the Journey Timeline.'
      };
    }

    // 7. General High-Jewellery Response
    return {
      answer: `Aurum & Co. is a high-jewellery house orchestrating bespoke client journeys across 10 stages: Bespoke Design CAD, Bullion & Gemstone Sourcing, Master Artisan Handcrafting, BIS Hallmarking, Armored Boutique Transit, Private VIP Salon Consultation, Point of Sale, GIA Certification, Atelier Repairs, and Lifetime Exchange Upgrades.`,
      category: 'general_inquiry',
      confidence: 0.90,
      relevantRecords: ['10-Stage Journey Pipeline', 'Mumbai Flagship Boutique', 'UB City Salon'],
      recommendedAction: 'Use the search bar or select a specific patron profile (e.g., Rahul Sharma or Priya Reddy) for granular intelligence.'
    };
  }
};
