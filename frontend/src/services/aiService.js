import api from './api';
export { customerService, journeyService, ticketService } from './customerService';

export const aiService = {
  async analyzeInteraction(text) {
    const res = await api.post('/ai/analyze-interaction', { text });
    return res.data;
  },

  async predictIntent(text) {
    const res = await api.post('/ai/predict-intent', { text });
    return res.data;
  },

  async analyzeSentiment(text) {
    const res = await api.post('/ai/analyze-sentiment', { text });
    return res.data;
  },

  async draftResponse(data) {
    const res = await api.post('/ai/draft-response', data);
    return res.data;
  },

  async askConcierge(query, customerId = null) {
    const res = await api.post('/ai/ask-concierge', { query, customerId });
    return res.data;
  },

  async getRuns() {
    const res = await api.get('/ai/runs');
    return res.data;
  }
};

export const recommendationService = {
  async list(params = {}) {
    const res = await api.get('/recommendations', { params });
    return res.data;
  },

  async evaluate(customerId) {
    const res = await api.post('/recommendations/evaluate', { customerId });
    return res.data;
  },

  async approve(id, finalActionTaken = null) {
    const res = await api.post(`/recommendations/${id}/approve`, { final_action_taken: finalActionTaken });
    return res.data;
  },

  async reject(id, reason = 'Rejected by reviewer') {
    const res = await api.post(`/recommendations/${id}/reject`, { reason });
    return res.data;
  },

  async override(id, { override_reason, final_action_taken }) {
    const res = await api.post(`/recommendations/${id}/override`, {
      decision: 'overridden',
      override_reason,
      final_action_taken
    });
    return res.data;
  },

  async submitFeedback(data) {
    const res = await api.post('/recommendations/feedback', data);
    return res.data;
  }
};

export const analyticsService = {
  async getDashboard() {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  async downloadCsv() {
    const res = await api.get('/analytics/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jewellery_customer_journey_report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const notificationService = {
  async list(params = {}) {
    const res = await api.get('/notifications', { params });
    return res;
  },

  async markRead(id) {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllRead() {
    const res = await api.post('/notifications/mark-all-read');
    return res.data;
  }
};

export const userService = {
  async list() {
    const res = await api.get('/users');
    return res.data;
  },

  async listRoles() {
    const res = await api.get('/users/roles');
    return res.data;
  },

  async create(data) {
    const res = await api.post('/users', data);
    return res.data;
  },

  async toggleStatus(id, isActive) {
    const res = await api.patch(`/users/${id}/status`, { is_active: isActive });
    return res.data;
  }
};

export const auditService = {
  async list(params = {}) {
    const res = await api.get('/audit-logs', { params });
    return res;
  }
};

export const settingsService = {
  async getAll() {
    const res = await api.get('/settings');
    return res.data;
  },

  async update(config_key, config_value) {
    const res = await api.put('/settings', { config_key, config_value });
    return res.data;
  }
};

export const consentService = {
  async getByCustomerId(customerId) {
    const res = await api.get(`/consents/${customerId}`);
    return res.data;
  },

  async update(customerId, data) {
    const res = await api.put(`/consents/${customerId}`, data);
    return res.data;
  }
};

export const segmentService = {
  async listSegments() {
    const res = await api.get('/segments');
    return res.data;
  },

  async createSegment(data) {
    const res = await api.post('/segments', data);
    return res.data;
  },

  async listCampaigns() {
    const res = await api.get('/segments/campaigns');
    return res.data;
  },

  async createCampaign(data) {
    const res = await api.post('/segments/campaigns', data);
    return res.data;
  }
};
