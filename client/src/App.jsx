import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import MenuList from "./pages/MenuList";
import Slot from "./pages/Slot";
import BookingList from "./pages/BookingList";
import HanldeBooking from "./pages/Restaurant-Panal/HandleBooking";
import Menu from "./pages/Menu";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { AxiosInterceptor } from "./services/apiClient";
import Loader from "./components/common/Loader";
import { ConfirmationProvider } from "./context/ConfirmationContext";
import { ToastProvider } from "./components/common/ToastProvider";
import Bills from "./pages/Bills";
import MenuByRestaurant from "./components/Restaurant-Panal/MenuByRestaurant";
import PublicMenu from "./pages/PublicMenu";
import NetworkStatus from "./components/common/NetworkStatus";
import { useServerStatus } from "./context/ServerStatusContext";
import ServerDownUI from "./context/ServerDownBanner";
import { useEffect } from "react";
import ChatList from "./pages/ChatList";

function App() {
  const { isServerDown, setServerDown } = useServerStatus();

  useEffect(() => {
    const handleServerError = (event) => {
      setServerDown(event.detail);
    };

    window.addEventListener('serverError', handleServerError);

    return () => {
      window.removeEventListener('serverError', handleServerError);
    };
  }, [setServerDown]);

  if (isServerDown) {
    return <ServerDownUI />;
  }
  const GlobalLoader = () => {
    const { isLoading } = useLoading();
    return (
      <Loader loading={isLoading} className="fixed inset-0 z-50 bg-white/50" />
    );
  };

  return (
    <>
      <NetworkStatus>
        <LoadingProvider>
          <ConfirmationProvider>
            <ToastProvider>
              <AxiosInterceptor>
                <GlobalLoader />
                <Toaster />
                <Routes>
                  <Route path="/" element={<LoginLayout />}>
                    <Route index element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  <Route path="/menu" element={<PublicMenu />} />

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
                  </Route>

                  <Route
                    path="restaurant"
                    element={
                      <ProtectedRoute requiredRole="restaurant">
                        <RestaurantLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="restaurant/booking"
                      element={<HanldeBooking />}
                    />
                  </Route>

                  <Route
                    path="home/*"
                    element={
                      <ProtectedRoute>
                        <HomeLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="restaurant" element={<RestoDetails />} />
                    <Route path="chat" element={<ChatList />} />

                    <Route path="bookings" element={<MyBookings />} />
                    <Route path="menu" element={<PublicMenu />} />
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
                    {/* <Route path="bills" element={<Bills />} /> */}
                  </Route>

                  <Route
                    path="restaurant"
                    element={
                      <ProtectedRoute requiredRole="restaurant">
                        <RestaurantLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="addmenu/:id" element={<Menu />} />
                    <Route path="editmenu/:id" element={<Menu />} />
                    <Route path="" element={<MenuByRestaurant />} />
                    <Route
                      index
                      path="restaurant/booking"
                      element={<HanldeBooking />}
                    />
                    <Route path="restaurant/bills" element={<Bills />} />
                    <Route path="chats" element={<ChatList />} />

                  </Route>

                  <Route path="/dashboard" element={<DashboardRedirect />} />

                  <Route path="*" element={<DashboardRedirect />} />
                </Routes>
              </AxiosInterceptor>
            </ToastProvider>
          </ConfirmationProvider>
        </LoadingProvider>
      </NetworkStatus>
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
