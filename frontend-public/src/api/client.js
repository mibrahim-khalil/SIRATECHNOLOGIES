import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// No auth needed for public site — but attach FormData handling
client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Optional: log errors in dev
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.warn(
        "[API]",
        error?.config?.method?.toUpperCase(),
        error?.config?.url,
        error?.response?.status || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default client;