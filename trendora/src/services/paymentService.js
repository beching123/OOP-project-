import api from './api';

export const paymentService = {
  initiate: (paymentData) =>
    api.post('/payments/initiate', paymentData),

  verify: (transactionId) =>
    api.post('/payments/verify', { transactionId }),

  getPaymentMethods: () =>
    api.get('/payments/methods'),
};

export default paymentService;
