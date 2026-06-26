import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // important if you use cookies / JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
