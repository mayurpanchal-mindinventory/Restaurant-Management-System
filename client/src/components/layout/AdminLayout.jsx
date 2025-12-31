import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import {
  LogOut,
  LayoutDashboard,
  Utensils,
  CalendarCheck,
  UserCircle,
  Bell
} from "lucide-react";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Restaurants", path: "/admin", icon: Utensils },
    { name: "Bookings", path: "/admin/bookingList", icon: CalendarCheck },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <nav className="hidden md:flex w-72 flex-col bg-slate-900 text-white fixed inset-y-0 z-50">
        {/* Sidebar Logo */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">Admin<span className="text-indigo-400">Hub</span></span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 space-y-1.5">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive(item.path)
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <item.icon size={20} className={isActive(item.path) ? "text-white" : "group-hover:text-indigo-400"} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col">
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Dashboard Overview</h2>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back, Administrator</h1>
            </div>

            <div className="flex items-center gap-6">

              <div className="h-8 w-[1px] bg-slate-200"></div>

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">System Admin</p>
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Super Access</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <UserCircle size={28} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Container */}
        <main className="p-8 min-h-[calc(100vh-80px)]">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* The individual page components (Restaurants, Bookings) will render inside this div */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
