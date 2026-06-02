import api from './api';

export const customerService = {
  getCustomers: (params = {}) =>
    api.get('/customers', { params }),

  getCustomer: (id) =>
    api.get(`/customers/${id}`),

  getCustomerOrders: (id) =>
    api.get(`/customers/${id}/orders`),
};

export default customerService;
