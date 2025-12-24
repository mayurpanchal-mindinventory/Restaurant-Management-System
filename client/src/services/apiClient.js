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
import { toast } from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000
});

export const AxiosInterceptor = ({ children }) => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        showLoader(); // Increment request count
        const token = localStorage.getItem("token");
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      },
      (error) => {
        hideLoader();
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        hideLoader();
        return response;
      },
      (error) => {
        hideLoader();
        const status = error.response?.status;
        console.log(status);

        const message = error.response?.data?.message || error.message || "An unexpected error occurred";
        switch (status) {
          case 401:
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/";
            break;
          case 403:
            toast.error("You do not have permission to perform this action.");
            break;
          case 404:
            toast.error("Resource not found.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            if (!error.response) {
              toast.error("Network error. Please check your connection.");
            } else {
              //  toast.error(message);
            }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount to prevent memory leaks
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [showLoader, hideLoader]);

  return children;
};

// Export your API methods
const apiMethods = {
  get: apiClient.get,
  post: apiClient.post,
  put: apiClient.put,
  patch: apiClient.patch,
  delete: apiClient.delete,
  getFeaturedRestaurants: () => apiClient.get("api/admin/display-restaurant"),
};

export default apiMethods;
