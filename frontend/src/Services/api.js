import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');

// Attendance
export const checkIn = (location) => api.post('/attendance/checkin', location);
export const checkOut = (id, location) => api.put(`/attendance/checkout/${id}`, location);
export const getMyAttendances = () => api.get('/attendance/my');
export const getActiveAttendance = () => api.get('/attendance/active');

// Admin
export const getVolunteers = () => api.get('/admin/volunteers');
export const toggleVolunteerStatus = (id) => api.put(`/admin/volunteers/${id}/toggle`);
export const getAllAttendances = () => api.get('/admin/attendances');
export const getReports = (params) => api.get('/admin/reports', { params });
export const getStats = () => api.get('/admin/stats');

export default api;