import axios from 'axios';

// Helper function to resolve the API Base URL dynamically and prevent double-slashes
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://room-finder-mern.onrender.com' : '');
  if (!envUrl) return '/api';
  
  let s = envUrl.trim().replace(/\/+$/, '');
  if (!s.endsWith('/api')) {
    s += '/api';
  }
  const [proto, rest] = s.split('://');
  if (rest) {
    return `${proto}://${rest.replace(/\/+/g, '/')}`;
  }
  return s.replace(/\/+/g, '/');
};

// Create an axios instance
const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false
});

// Add a request interceptor to include token in headers if available
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally if needed
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access
    if (error.response?.status === 401) {
      // Remove user info from localStorage
      localStorage.removeItem('userInfo');
      // In a real app, you might want to redirect to login page
    }
    
    return Promise.reject(error);
  }
);

export default API;