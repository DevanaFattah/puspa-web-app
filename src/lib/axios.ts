// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://puspa-api.alfirdausina.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor untuk inject token dari localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `${tokenType} ${token}`;
        
        if (process.env.NODE_ENV === "development") {
          console.log("[Axios] Inject token:", config.headers.Authorization);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani error respons secara global (misal: 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.warn("[Axios] Sesi berakhir (401), membersihkan localStorage...");
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
