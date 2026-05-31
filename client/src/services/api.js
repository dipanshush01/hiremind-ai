import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('token', data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return API(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`),
  updateProfile: (data) => API.put('/auth/update-profile', data),
  updatePassword: (data) => API.put('/auth/update-password', data),
};

// Interview
export const interviewAPI = {
  start: (data) => API.post('/interviews/start', data),
  get: (id) => API.get(`/interviews/${id}`),
  getUserInterviews: (page = 1) => API.get(`/interviews?page=${page}`),
  submitAnswer: (id, data) => API.post(`/interviews/${id}/answer`, data),
  end: (id) => API.post(`/interviews/${id}/end`),
  reportCheating: (id, event) => API.post(`/interviews/${id}/anti-cheating`, { event }),
};

// Resume
export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  analyze: (formData) => API.post('/resume/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAnalysis: () => API.get('/resume/analysis'),
};

// Analytics
export const analyticsAPI = {
  getUserAnalytics: () => API.get('/analytics/me'),
  getDetailedReport: () => API.get('/analytics/report'),
  getAdminAnalytics: () => API.get('/analytics/admin'),
};

// Coding
export const codingAPI = {
  generateProblem: (data) => API.post('/coding/generate', data),
  submitCode: (id, data) => API.post(`/coding/${id}/submit`, data),
  getCodingRound: (id) => API.get(`/coding/${id}`),
  getHistory: () => API.get('/coding/history'),
};

export default API;
