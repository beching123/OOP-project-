import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const orderService = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const supportService = {
  getTickets: (params) => api.get('/support/tickets', { params }),
  getTicket: (id) => api.get(`/support/tickets/${id}`),
  reply: (id, message) => api.post(`/support/tickets/${id}/reply`, { message }),
  updateStatus: (id, status) => api.patch(`/support/tickets/${id}/status`, { status }),
  assign: (id, staffId) => api.patch(`/support/tickets/${id}/assign`, { staffId }),
};

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const customerService = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomer: (id) => api.get(`/customers/${id}`),
  getCustomerOrders: (id) => api.get(`/customers/${id}/orders`),
};

export const staffService = {
  getStaff: (params) => api.get('/admin/staff', { params }),
  getStaffMember: (id) => api.get(`/admin/staff/${id}`),
  create: (data) => api.post('/admin/staff', data),
  update: (id, data) => api.put(`/admin/staff/${id}`, data),
  delete: (id) => api.delete(`/admin/staff/${id}`),
  updateRole: (id, role) => api.patch(`/admin/staff/${id}/role`, { role }),
  updateStatus: (id, status) => api.patch(`/admin/staff/${id}/status`, { status }),
};

export const settingsService = {
  getSettings: () => api.get('/settings'),
  getSetting: (key) => api.get(`/settings/${key}`),
  saveSettings: (settings) => api.put('/settings', settings),
  saveSetting: (key, value) => api.put(`/settings/${key}`, { value }),
};

export const auditService = {
  getAuditRecords: (params) => api.get('/admin/audit', { params }),
  logAudit: (data) => api.post('/admin/audit', data),
};

export const notificationService = {
  getNotifications: (userId, limit) => api.get('/notifications', { params: { userId, limit } }),
  getUnreadCount: (userId) => api.get('/notifications/unread-count', { params: { userId } }),
  create: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: (userId) => api.patch('/notifications/read-all', { params: { userId } }),
};

export const messagingService = {
  getConversations: (userId) => api.get('/staff/messages', { params: { userId } }),
  getConversation: (partnerId, userId) => api.get(`/staff/messages/${partnerId}`, { params: { userId } }),
  sendMessage: (data) => api.post('/staff/messages', data),
  getUnreadCount: (userId) => api.get('/staff/messages/unread-count', { params: { userId } }),
  getTeam: () => api.get('/admin/staff'),
};
