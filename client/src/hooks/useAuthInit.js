import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromStorage, clearAuthState } from "../slices/authSlice";

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log("Initializing auth...");
        const storedUser = localStorage.getItem("user");
        console.log("Stored user:", storedUser);

        if (storedUser && storedUser !== "undefined") {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed user:", parsedUser);

          if (parsedUser && (parsedUser.role || parsedUser.user?.role)) {
            const normalizedUser = parsedUser.user || parsedUser;
            console.log("Normalized user:", normalizedUser);

            dispatch(setUserFromStorage(normalizedUser));
            console.log("Auth state initialized successfully");
          } else {
            console.log("Invalid user data, clearing localStorage");
            localStorage.removeItem("user");
            dispatch(clearAuthState());
          }
        } else {
          console.log("No stored user found");
          dispatch(clearAuthState());
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        localStorage.removeItem("user");
        dispatch(clearAuthState());
      }
    };

    //  small delay to ensure DOM is ready
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, [dispatch]);
};

export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      // Return the normalized user (either directly or from user property)
      return parsedUser.user || parsedUser;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const hasRequiredRole = (user, requiredRole) => {
  if (!user || !requiredRole) return true;

  return user.role === requiredRole;
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user;
};
