import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    verifyPin: (pin) => apiClient.post('/auth/verify-pin', { pin }),
    resetPassword: (email) => apiClient.post('/auth/reset-password', { email }),
    getProfile: () => apiClient.get('/auth/profile'),
    changePassword: (data) => apiClient.post('/auth/change-password', data),
    refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  },
  devices: {
    getAll: () => apiClient.get('/devices'),
    getById: (id) => apiClient.get(`/devices/${id}`),
    register: (deviceData) => apiClient.post('/devices/register', deviceData),
    update: (id, data) => apiClient.put(`/devices/${id}`, data),
    delete: (id) => apiClient.delete(`/devices/${id}`),
    lock: (id) => apiClient.post(`/devices/${id}/lock`),
    unlock: (id) => apiClient.post(`/devices/${id}/unlock`),
    setLostMode: (id, data) => apiClient.post(`/devices/${id}/lost-mode`, data),
    deactivateLostMode: (id) => apiClient.delete(`/devices/${id}/lost-mode`),
  },
  monitoring: {
    startCamera: (deviceId) => apiClient.post(`/monitoring/camera/${deviceId}/start`),
    stopCamera: () => apiClient.post('/monitoring/camera/stop'),
    startScreen: (deviceId) => apiClient.post(`/monitoring/screen/${deviceId}/start`),
    stopScreen: () => apiClient.post('/monitoring/screen/stop'),
    getSmsHistory: (deviceId) => apiClient.get(`/monitoring/sms/${deviceId}`),
    getGallery: (deviceId) => apiClient.get(`/monitoring/gallery/${deviceId}`),
    deleteSms: (smsId) => apiClient.delete(`/monitoring/sms/${smsId}`),
    exportSms: (deviceId) => apiClient.get(`/monitoring/sms/${deviceId}/export`),
    downloadFile: (fileId) => apiClient.get(`/monitoring/files/${fileId}/download`),
    deleteFile: (fileId) => apiClient.delete(`/monitoring/files/${fileId}`),
  },
  admin: {
    getUsers: () => apiClient.get('/admin/users'),
    createUser: (userData) => apiClient.post('/admin/users', userData),
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    suspendUser: (id) => apiClient.post(`/admin/users/${id}/suspend`),
    activateUser: (id) => apiClient.post(`/admin/users/${id}/activate`),
    getRoles: () => apiClient.get('/admin/roles'),
    updateRole: (id, data) => apiClient.put(`/admin/roles/${id}`, data),
    getLicenses: () => apiClient.get('/admin/licenses'),
    createLicense: (data) => apiClient.post('/admin/licenses', data),
    updateLicense: (id, data) => apiClient.put(`/admin/licenses/${id}`, data),
    getSettings: () => apiClient.get('/admin/settings'),
    updateSettings: (data) => apiClient.put('/admin/settings', data),
    getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }),
  },
  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats'),
    getActivity: (params) => apiClient.get('/dashboard/activity', { params }),
    getDeviceStats: () => apiClient.get('/dashboard/device-stats'),
  },
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
  },
};

export default apiClient;
