import axios from "axios";

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

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // important if you use cookies / JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
