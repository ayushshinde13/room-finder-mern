import axios from 'axios';

// Helper function to resolve the API Base URL dynamically
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  // Production fallback to Render backend
  if (import.meta.env.PROD) {
    return 'https://room-finder-mern.onrender.com/api';
  }
  return '/api';
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