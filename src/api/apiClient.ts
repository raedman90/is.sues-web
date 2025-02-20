import axios from "axios";
import authenticateUser from "./apiAuth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://is-sues-omega.vercel.app/api",
});

api.interceptors.request.use(
  (config) => {
    const token = authenticateUser();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
