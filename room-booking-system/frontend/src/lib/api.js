import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login or show message
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  },
);

// Rooms endpoints
export const roomsApi = {
  getList: () => apiClient.get("/rooms"),
  getById: (id) => apiClient.get(`/rooms/${id}`),
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
  create: (data) => apiClient.post("/bookings", data),
};

// Events endpoints
export const eventsApi = {
  getPublished: () => apiClient.get("/events/published"),
  getById: (id) => apiClient.get(`/events/${id}`),
};

export default apiClient;
