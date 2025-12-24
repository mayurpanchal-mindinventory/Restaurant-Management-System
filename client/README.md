# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




import { toast } from "react-hot-toast"; // Recommended for 2025

export const AxiosInterceptor = ({ children }) => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        showLoader();
        const token = localStorage.getItem("token");
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      },
      (error) => {
        hideLoader();
        return Promise.reject(error);
      }
    );

    // Response Interceptor (The "Global Try-Catch")
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        hideLoader();
        return response;
      },
      (error) => {
        hideLoader();
        
        // 1. Extract error details
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || "An unexpected error occurred";

        // 2. Global Logic for specific status codes
        switch (status) {
          case 401:
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect on auth failure
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
            // Handle network errors (no response) or other issues
            if (!error.response) {
              toast.error("Network error. Please check your connection.");
            } else {
              toast.error(message);
            }
        }

        // 3. Propagate error so local components can still handle it if needed
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [showLoader, hideLoader]);

  return children;
};
