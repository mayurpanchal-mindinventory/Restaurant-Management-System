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
import HomeLayout from "./components/layout/HomeLayout";
import RestoDetails from "./pages/RestoDetails";
import MyBookings from "./pages/MyBookings";
import RestaurantLayout from "./components/layout/Restaurant-Panal/RestaurantLayout";
import { Menu } from "lucide-react";
import MenuList from "./pages/MenuList";
import Slot from "./pages/Slot";

import BookingList from "./pages/BookingList";
import HanldeBooking from "./pages/Restaurant-Panal/HandleBooking";
import Bills from "./pages/Bills";
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
          <Route path="add/:id" element={<AddRestaurant />} />
          <Route path="menu/:id" element={<MenuList />} />
          <Route path="addmenu/:id" element={<Menu />} />
          <Route path="editmenu/:id" element={<Menu />} />

          <Route path="slot/:id" element={<Slot />} />
          <Route path="bookingList" element={<BookingList />} />
          <Route path="bills" element={<Bills />} />
        </Route>

        <Route
          path="restaurant"
          element={
            <ProtectedRoute requiredRole="restaurant">
              <RestaurantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="restaurant/booking" element={<HanldeBooking />} />
          <Route path="restaurant/bills" element={<Bills />} />
        </Route>

        <Route
          path="Home/*"
          element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="restaurant" element={<RestoDetails />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>

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
