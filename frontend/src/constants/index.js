export const ROLES = {
  ADMIN: 'admin',
  SALES_MANAGER: 'sales_manager',
  MARKETING_MANAGER: 'marketing_manager',
  SERVICE_AGENT: 'service_agent',
  CUSTOMER: 'customer'
};

export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    roleLabel: 'Admin / Executive',
    email: 'admin@aurumjewellery.com',
    password: 'password123',
    desc: 'Full operational control, RBAC, settings, audit logs & overrides'
  },
  {
    role: 'sales_manager',
    roleLabel: 'Sales Manager',
    email: 'sales.manager@aurumjewellery.com',
    password: 'password123',
    desc: 'VIP customer journeys, high-ticket approvals, and sales pipeline'
  },
  {
    role: 'marketing_manager',
    roleLabel: 'Marketing Manager',
    email: 'marketing@aurumjewellery.com',
    password: 'password123',
    desc: 'Customer segments, campaigns, consent governance, and analytics'
  },
  {
    role: 'service_agent',
    roleLabel: 'Service Agent',
    email: 'service@aurumjewellery.com',
    password: 'password123',
    desc: 'Concierge desk, service tickets, AI response drafts, repair tracking'
  },
  {
    role: 'customer',
    roleLabel: 'Customer',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    desc: 'Client portal view for 360 profile, bespoke journey, and GIA certificates'
  }
];

export const JOURNEY_STAGES = [
  { key: 'design', label: '1. Bespoke Design & CAD', icon: 'Sparkles', short: 'Design' },
  { key: 'sourcing', label: '2. Gemstone & Bullion Sourcing', icon: 'Gem', short: 'Sourcing' },
  { key: 'production', label: '3. Master Artisan Handcrafting', icon: 'Hammer', short: 'Production' },
  { key: 'hallmarking', label: '4. BIS Hallmarking & Laser Assay', icon: 'Award', short: 'Hallmarking' },
  { key: 'inventory_transfer', label: '5. Armored Boutique Transit', icon: 'Truck', short: 'Vault Transit' },
  { key: 'consultation', label: '6. Private VIP Salon Viewing', icon: 'Glasses', short: 'Consultation' },
  { key: 'sale', label: '7. Point of Sale & Invoicing', icon: 'Receipt', short: 'Sale' },
  { key: 'certification', label: '8. GIA / IGI Certification', icon: 'FileCheck', short: 'Certification' },
  { key: 'repair', label: '9. Atelier Restoration & Care', icon: 'Wrench', short: 'Repair' },
  { key: 'exchange', label: '10. Lifetime Upgrade & Exchange', icon: 'Repeat', short: 'Exchange' }
];

export const TIER_COLORS = {
  'Elite Bespoke': 'bg-amber-100 text-amber-900 border-amber-400',
  'VIP': 'bg-purple-100 text-purple-900 border-purple-300',
  'Platinum': 'bg-slate-200 text-slate-900 border-slate-400',
  'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-400',
  'Silver': 'bg-gray-100 text-gray-800 border-gray-300'
};

export const CHURN_COLORS = {
  high: 'bg-rose-100 text-rose-800 border-rose-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-emerald-100 text-emerald-800 border-emerald-300'
};
