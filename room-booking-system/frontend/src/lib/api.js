import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },
};

// Rooms endpoints
export const roomsApi = {
  getList: () => apiClient.get('/rooms'),
  getById: (id) => apiClient.get(`/rooms/${id}`),
  create: (formData) => apiClient.post('/rooms', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => apiClient.put(`/rooms/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => apiClient.delete(`/rooms/${id}`),
  checkAvailability: (roomId, checkIn, checkOut) =>
    apiClient.get(`/bookings/${roomId}/availability`, {
      params: { checkIn, checkOut },
    }),
};

// Bookings endpoints
export const bookingsApi = {
  checkAvailability: (roomId, checkIn, checkOut) =>
    apiClient.get(`/bookings/${roomId}/availability`, {
      params: { checkIn, checkOut },
    }),
  create: (data) => apiClient.post('/bookings', data),
  getAll: () => apiClient.get('/bookings'),
};

// Events endpoints
export const eventsApi = {
  getPublished: () => apiClient.get('/events/published'),
  getList: () => apiClient.get('/events'),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (formData) => apiClient.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => apiClient.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  publish: (id) => apiClient.patch(`/events/${id}/publish`),
  delete: (id) => apiClient.delete(`/events/${id}`),
};

export default apiClient;