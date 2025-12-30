// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: "http://localhost:5000",
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default {
//   get: apiClient.get,
//   post: apiClient.post,
//   put: apiClient.put,
//   patch: apiClient.patch,
//   delete: apiClient.delete,
//   getFeaturedRestaurants: () => apiClient.get("api/admin/display-restaurant"),
// };
// apiClient.js
import axios from "axios";
import { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";
import { toast } from "react-hot-toast";

export const apiClient = axios.create({
  baseURL: "http://192.168.1.213:5000",
  timeout: 5000,
  withCredentials: true,
});

const refreshAxios = axios.create({
  baseURL: "http://192.168.1.213:5000/api/auth",
  withCredentials: true,
});

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
  toast.success("Logged out");
  window.location.href = "/";
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AxiosInterceptor = ({ children }) => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // A) Request Interceptor for Loading UI
    const loadingRequestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        showLoader();
        return config;
      }
    );

    // B) Response Interceptor for Loading UI and Auth Errors
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        hideLoader();
        return response;
      },
      async (error) => {
        hideLoader();
        const originalRequest = error.config;

        // Handle Hard Unauthorized (401)
        const isAuthError = error?.response?.status === 401;
        const message = error?.response?.data?.message;
        const type = error?.response?.data?.type;

        if (
          isAuthError &&
          (message === "Token missing" || type === "TOKEN_INVALID")
        ) {
          logoutAndRedirect();
          return Promise.reject(error);
        }

        // Handle Expiry (403) with Token Refresh
        if (
          error?.response?.status === 403 &&
          (message === "Token expired" || type === "TOKEN_EXPIRED") &&
          !originalRequest._retry
        ) {
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

    // Cleanup on Unmount
    return () => {
      apiClient.interceptors.request.eject(loadingRequestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [showLoader, hideLoader]);

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
