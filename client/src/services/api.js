import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type" : "application/json",
    },
});

// Interceptor: agrega token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    const status = error.response?.status;

    if (status === 401 && token) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);



export default api;
