import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
});

// Attach token automatically to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("sira_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set correct Content-Type based on payload
  if (config.data instanceof FormData) {
    // Let browser set multipart boundary — DO NOT force it
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Handle 401 globally (auto logout)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sira_admin_token");
      localStorage.removeItem("sira_admin_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;