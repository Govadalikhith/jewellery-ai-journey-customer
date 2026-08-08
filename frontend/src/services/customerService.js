import api from './api';

export const customerService = {
  async list(params = {}) {
    const res = await api.get('/customers', { params });
    return res;
  },

  async getById(id) {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/customers', data);
    return res.data;
  }
};

export const journeyService = {
  async list(params = {}) {
    const res = await api.get('/journeys', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/journeys/${id}`);
    return res.data;
  },

  async updateStage(id, data) {
    const res = await api.patch(`/journeys/${id}/stage`, data);
    return res.data;
  }
};

export const ticketService = {
  async list(params = {}) {
    const res = await api.get('/tickets', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/tickets/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/tickets', data);
    return res.data;
  },

  async addMessage(id, data) {
    const res = await api.post(`/tickets/${id}/messages`, data);
    return res.data;
  },

  async generateAiDraft(id) {
    const res = await api.post(`/tickets/${id}/ai-draft`);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/tickets/${id}/status`, { status });
    return res.data;
  }
};
