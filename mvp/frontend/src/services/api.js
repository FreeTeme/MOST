import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });  // Теперь один порт!

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfileStats = () => api.get('/profile/stats');


// Для работы со СВОИМИ социальными сетями
export const getLimitedSocials = (user_id, limit = 3) => api.get('/socials', { 
  params: { user_id, limit } 
});

// Для КАТАЛОГА (все социальные сети)
export const getCatalogSocials = (params = {}) => api.get('/socials/catalog', { params });
export const getPlatforms = () => api.get('/socials/platforms');
export const getRegions = () => api.get('/socials/regions');

// Остальные методы остаются без изменений


// api.js
// api.js
export const getLimitedReviews = (user_id, limit = 3) => api.get('/reviews', { 
  params: { user_id, limit } 
});
export const getUserReviews = (user_id, limit = 3) => api.get(`/reviews/user/${user_id}`, { params: { limit } });

// api.js
export const getReviews = params => api.get('/reviews/query', { params });
export const addReview = data => api.post('/reviews/add', data);
export const getReviewsStats = (user_id) => api.get(`/reviews/stats/${user_id}`);

// Остальные методы остаются без изменений
export const getSocials = params => api.get('/socials', { params });
export const addSocial = data => api.post('/socials', data);
export const updateSocial = (id, data) => api.put(`/socials/${id}`, data);
export const deleteSocial = id => api.delete(`/socials/${id}`);
export const getProducts = () => api.get('/products');
export const addProduct = data => api.post('/products', data);
export const getCatalogProducts = params => api.get('/catalog/products', { params });
export const getCatalogBloggers = params => api.get('/catalog/bloggers', { params });
export const applyToProduct = data => api.post('/applications', data);
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminAnalytics = () => api.get('/admin/analytics');
