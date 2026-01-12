import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoading } from '../context/LoadingContext'
export const apiClient = axios.create({
  baseURL: "/",
  timeout: 10000,
  withCredentials: true,
});
let setIsServerDownCallback = () => { };

export const setServerDownCallback = (callback) => {
  setIsServerDownCallback = callback;
};
const refreshAxios = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});
let showGlobalLoader = () => { };
let hideGlobalLoader = () => { };
let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedRequestsQueue = [];
};

const logoutAndRedirect = () => {
  localStorage.clear();
  toast.error("Session expired. Please login again.");
  window.location.href = "/";
};

apiClient.interceptors.request.use((config) => {
  showGlobalLoader();
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => { hideGlobalLoader(); setServerDownCallback(false); return response; },
  async (error) => {
    hideGlobalLoader();
    const originalRequest = error.config;
    const isAuthError = error?.response?.status === 401;
    const isExpiryError = error?.response?.status === 403;
    const message = error?.response?.data?.message;
    const type = error?.response?.data?.type;
    if (error.response?.status >= 500 || error.code === 'NETWORK_ERROR' || error.message === 'Network Error' || error.message.includes('timeout')) {
      window.dispatchEvent(new CustomEvent('serverError', { detail: true }));
    }

    if (isAuthError && (message === "Token missing" || type === "TOKEN_INVALID")) {
      logoutAndRedirect();
      return Promise.reject(error);
    }

    if (isExpiryError && (message === "Token expired" || type === "TOKEN_EXPIRED") && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshAxios.post("/refresh");
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const AxiosInterceptor = ({ children }) => {
  const { showLoader, hideLoader } = useLoading();

  showGlobalLoader = showLoader;
  hideGlobalLoader = hideLoader;

  return children;
};

const apiMethods = {
  get: apiClient.get,
  post: apiClient.post,
  put: apiClient.put,
  patch: apiClient.patch,
  delete: apiClient.delete,
  getFeaturedRestaurants: () => apiClient.get("api/admin/display-restaurant"),
};

export default apiMethods;
