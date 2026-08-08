export const ROLES = {
  ADMIN: 'admin',
  SALES_MANAGER: 'sales_manager',
  MARKETING_MANAGER: 'marketing_manager',
  SERVICE_AGENT: 'service_agent',
  CUSTOMER: 'customer'
};

export const JOURNEY_STAGES = [
  'design',
  'sourcing',
  'production',
  'hallmarking',
  'inventory_transfer',
  'consultation',
  'sale',
  'certification',
  'repair',
  'exchange'
];

export const JOURNEY_STAGE_LABELS = {
  design: '1. Bespoke Design & CAD',
  sourcing: '2. Gemstone & Bullion Sourcing',
  production: '3. Master Artisan Handcrafting',
  hallmarking: '4. BIS Hallmarking & Laser Assay',
  inventory_transfer: '5. Armored Boutique Transit',
  consultation: '6. Private VIP Salon Viewing',
  sale: '7. Point of Sale & Invoicing',
  certification: '8. GIA / IGI Gemological Certification',
  repair: '9. Atelier Restoration & Maintenance',
  exchange: '10. Lifetime Upgrade & Exchange'
};

export const CHANNELS = {
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  IN_PERSON: 'in_person'
};

export const RECOMMENDATION_STATUS = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  OVERRIDDEN: 'overridden',
  COMPLETED: 'completed'
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING_APPROVAL: 'pending_approval',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};
