import axios from "axios";

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

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // important if you use cookies / JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
