import axios from "axios";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // important if you use cookies / JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
