import axios from "axios";

// axios instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding the JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // stored after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
