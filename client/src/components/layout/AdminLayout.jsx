import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

const navigation = [
  { name: "Restaurants", href: "/admin", current: false },
  { name: "Bookings", href: "/admin/bookingList", current: false },
  { name: "Bills", href: "/admin/bills", current: false },
  // { name: "Slots", href: "slot", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // Helper to apply active styles
  const linkStyle = (path) =>
    `block px-4 py-2 rounded-md transition ${pathname === path ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div>

        <div className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin" className={linkStyle("/admin")}>
            Restaurants
          </Link>

          <Link to="/admin/bookingList" className={linkStyle("/admin/bookingList")}>
            Bookings
          </Link>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="m-4 flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 rounded-md transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </header>

        <main className="p-8 flex-1">
          <div className="bg-white rounded-lg shadow p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
