import api from './api';

export const productService = {
  getProducts: (params = {}) =>
    api.get('/products', { params }),

  getProduct: (id) =>
    api.get(`/products/${id}`),

  createProduct: (data) =>
    api.post('/products', data),

  updateProduct: (id, data) =>
    api.put(`/products/${id}`, data),

  deleteProduct: (id) =>
    api.delete(`/products/${id}`),

  getFeatured: () =>
    api.get('/products', { params: { featured: true, limit: 8 } }),

  getByCategory: (categoryId, params = {}) =>
    api.get('/products', { params: { category: categoryId, ...params } }),

  search: (query, params = {}) =>
    api.get('/products', { params: { search: query, ...params } }),
};

export default productService;
