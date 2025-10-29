import axios from 'axios';
import { getToken } from './storage';

const API_BASE_URL = 'http://192.168.0.100:8000/api'; // Ganti dengan IP server Laravel Anda

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, bisa tambahkan logic logout di sini
      console.log('Token expired, please login again');
    }
    
    if (error.response?.status === 500) {
      console.log('Server error, please try again later');
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/login', { email, password }),
  
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: string;
  }) => api.post('/register', data),
  
  logout: () => api.post('/logout'),
  
  getUser: () => api.get('/user'),
};

export const absensiAPI = {
  checkIn: (data: { latitude: string; longitude: string }) => 
    api.post('/absensi/check-in', data),
  
  checkOut: (data: { latitude: string; longitude: string }) => 
    api.post('/absensi/check-out', data),
  
  getToday: () => api.get('/absensi/today'),
  
  getHistory: (params?: { 
    start_date?: string; 
    end_date?: string;
    page?: number;
  }) => api.get('/absensi/history', { params }),
  
  getSummary: () => api.get('/absensi/summary'),
};

export const adminAPI = {
  getEmployees: (params?: { 
    search?: string;
    page?: number;
  }) => api.get('/employees', { params }),
  
  createEmployee: (data: {
    name: string;
    email: string;
    password: string;
    role_id: string;
  }) => api.post('/employees', data),
  
  updateEmployee: (id: number, data: {
    name?: string;
    email?: string;
    password?: string;
    role_id?: string;
  }) => api.put(`/employees/${id}`, data),
  
  deleteEmployee: (id: number) => api.delete(`/employees/${id}`),
  
  getReport: (params?: {
    start_date?: string;
    end_date?: string;
    employee_id?: number;
    filter_by?: 'today' | 'week' | 'month' | 'year' | 'last30days';
    page?: number;
  }) => api.get('/absensi/report', { params }),
};

// Utility function untuk handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      // Jika ada multiple errors, ambil yang pertama
      const firstError = Object.values(error.response.data.errors)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      return String(firstError);
    }
    if (error.code === 'NETWORK_ERROR') {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }
    if (error.code === 'TIMEOUT_ERROR') {
      return 'Request timeout. Silakan coba lagi.';
    }
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
};

export default api;