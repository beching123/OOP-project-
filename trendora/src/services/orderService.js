import api from './api';

export const orderService = {
  getOrders: (params = {}) =>
    api.get('/orders', { params }),

  getOrder: (id) =>
    api.get(`/orders/${id}`),

  createOrder: (orderData) =>
    api.post('/orders', orderData),

  updateOrderStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }),

  trackOrder: (orderNumber) =>
    api.get(`/orders/track/${orderNumber}`),

  getMyOrders: (params = {}) =>
    api.get('/orders/my', { params }),
};

export default orderService;
