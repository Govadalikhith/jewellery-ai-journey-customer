import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional()
});

export const customerCreateSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  tier: z.enum(['VIP', 'Platinum', 'Gold', 'Silver', 'Elite Bespoke']).optional(),
  preferred_store_id: z.string().optional(),
  preferred_metal: z.string().optional(),
  ring_size: z.string().optional(),
  favorite_gemstone: z.string().optional(),
  notes: z.string().optional()
});

export const journeyStageUpdateSchema = z.object({
  stage: z.enum([
    'design', 'sourcing', 'production', 'hallmarking', 'inventory_transfer',
    'consultation', 'sale', 'certification', 'repair', 'exchange'
  ]),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const ticketCreateSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  subject: z.string().min(3, 'Subject is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  message_text: z.string().optional()
});

export const ticketMessageSchema = z.object({
  message_text: z.string().min(1, 'Message cannot be empty'),
  channel: z.string().default('whatsapp'),
  is_ai_draft: z.boolean().optional()
});

export const approvalActionSchema = z.object({
  decision: z.enum(['approved', 'rejected', 'overridden']),
  override_reason: z.string().optional(),
  final_action_taken: z.string().optional()
}).refine(data => {
  if (data.decision === 'overridden') {
    return !!data.override_reason && data.override_reason.trim().length >= 5;
  }
  return true;
}, {
  message: 'A mandatory override reason (min 5 characters) is required when overriding AI recommendations.',
  path: ['override_reason']
});

export const consentUpdateSchema = z.object({
  channel: z.enum(['whatsapp', 'email', 'phone', 'sms', 'in_person']),
  is_consented: z.boolean(),
  weekly_frequency_cap: z.number().int().min(0).max(10).optional()
});

export const aiInteractionAnalyzeSchema = z.object({
  text: z.string().min(3, 'Interaction text is required'),
  customer_id: z.string().optional(),
  channel: z.string().optional()
});

export const aiResponseDraftSchema = z.object({
  ticket_id: z.string().min(1, 'Ticket ID is required'),
  customer_context: z.string().optional(),
  tone: z.enum(['luxury_concierge', 'formal_advisory', 'empathetic_service']).default('luxury_concierge')
});

export const modelFeedbackSchema = z.object({
  recommendation_id: z.string().min(1, 'Recommendation ID is required'),
  feedback_score: z.enum(['helpful', 'not_helpful', 'incorrect', 'correct', 'override_better']),
  feedback_notes: z.string().optional()
});

export const segmentCreateSchema = z.object({
  name: z.string().min(2, 'Segment name is required'),
  description: z.string().optional(),
  criteria: z.record(z.any()).default({})
});

export const settingsUpdateSchema = z.object({
  config_key: z.string().min(1, 'Configuration key is required'),
  config_value: z.record(z.any())
});
