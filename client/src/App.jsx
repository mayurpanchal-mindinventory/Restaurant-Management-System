import { Routes, Route, Navigate } from "react-router-dom";
import LoginLayout from "./components/layout/LoginLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./components/layout/AdminLayout";
import Restaurant from "./pages/Restaurant";
import AddRestaurant from "./pages/AddRestaurant";
import ProtectedRoute, {
  getDashboardRoute,
} from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginLayout />}>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="add" element={<AddRestaurant />} />
          <Route index element={<Restaurant />} />
        </Route>

        <Route
          path="restaurant/*"
          element={
            <ProtectedRoute requiredRole="restaurant">
              <Restaurant />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route path="*" element={<DashboardRedirect />} />
      </Routes>
    </>
  );
}

// Component to redirect users to their appropriate dashboard based on role
const DashboardRedirect = () => {
  const storedUser = localStorage.getItem("user");
  const currentUser =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  if (!currentUser) {
    return <Login />;
  }

  const dashboardRoute = getDashboardRoute(currentUser.role);
  return <Navigate to={dashboardRoute} replace />;
};

export default App;
