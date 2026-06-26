import axios from 'axios';

// Create an axios instance
const API = axios.create({
  // Use the REACT_APP_API_BASE_URL environment variable if available, otherwise default to production/api
  baseURL: '/api',
  
  // Set credentials to include cookies in cross-origin requests if needed
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