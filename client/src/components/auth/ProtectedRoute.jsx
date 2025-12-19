import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCurrentUser, hasRequiredRole } from "../../hooks/useAuthInit";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const currentUser = getCurrentUser();

  // Fallback to Redux state if localStorage is not available
  const effectiveUser = currentUser || user;
  const effectiveIsAuthenticated = currentUser ? true : isAuthenticated;

  // If no user found, redirect to login
  if (!effectiveUser || !effectiveIsAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role if required
  if (requiredRole && !hasRequiredRole(effectiveUser, requiredRole)) {
    // Redirect to appropriate dashboard based on user's role
    return <Navigate to={getDashboardRoute(effectiveUser.role)} replace />;
  }

  return children;
};

const getDashboardRoute = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "restaurant":
      return "/restaurant";
    case "user":
    default:
      return "/Home";
  }
};

export { ProtectedRoute, getDashboardRoute };
export default ProtectedRoute;
