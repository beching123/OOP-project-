import api from './api';

export const supportService = {
  getTickets: (params = {}) =>
    api.get('/support/tickets', { params }),

  getTicket: (id) =>
    api.get(`/support/tickets/${id}`),

  createTicket: (data) =>
    api.post('/support/tickets', data),

  replyToTicket: (id, message) =>
    api.post(`/support/tickets/${id}/reply`, { message }),

  updateTicketStatus: (id, status) =>
    api.patch(`/support/tickets/${id}/status`, { status }),

  assignTicket: (id, staffId) =>
    api.patch(`/support/tickets/${id}/assign`, { staffId }),
};

export default supportService;
