import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Социальные сети
export const getLimitedSocials = (user_id, limit = 3) => api.get('/socials', { 
  params: { user_id, limit } 
});

export const getSocials = (params = {}) => api.get('/socials', { params });
export const addSocial = (data) => api.post('/socials', data);
export const updateSocial = (id, data) => api.put(`/socials/${id}`, data);
export const deleteSocial = (id) => api.delete(`/socials/${id}`);

// Продукты и кампании
export const getProducts = (params = {}) => api.get('/products', { params });
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getCatalogProducts = (params = {}) => api.get('/products/catalog', { params });

// Каталог блогеров
export const getCatalogBloggers = (params = {}) => api.get('/products/bloggers', { params });

// Отзывы
export const getLimitedReviews = (user_id, limit = 3) => api.get('/reviews', { 
  params: { user_id, limit } 
});
export const getReviews = (params = {}) => api.get('/reviews/query', { params });
export const addReview = (data) => api.post('/reviews/add', data);
export const getReviewsStats = (user_id) => api.get(`/reviews/stats/${user_id}`);
// Заявки
export const applyToProduct = (data) => api.post('/applications', data);

// Админка
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminAnalytics = () => api.get('/admin/analytics');
