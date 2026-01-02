import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { LogOut, LayoutDashboard, Utensils, CalendarCheck } from "lucide-react";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#f8fafc]">
      <nav className="flex flex-col w-full md:w-72 md:h-screen bg-slate-900 text-white md:sticky md:top-0">
        <div className="flex items-center gap-3 p-5 md:p-8 border-b border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 bg-indigo-50 rounded-xl">
            <LayoutDashboard size={20} className="text-indigo-600" />
          </div>
          <span className="text-lg font-black uppercase tracking-tight">
            Admin<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        <div className="flex flex-col p-4 gap-2">

          <Link
            to="/admin"
            className={`flex items-center justify-center md:justify-normal gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${pathname === "/admin"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
          >
            <Utensils size={18} />
            <span>Restaurants</span>
          </Link>

          <Link
            to="/admin/bookingList"
            className={`flex items-center justify-center md:justify-normal gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${pathname === "/admin/bookingList"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
          >
            <CalendarCheck size={18} />
            <span>Bookings</span>
          </Link>

        </div>

        <div className="p-4 md:p-6 border-t  border-slate-800 md:mt-auto">
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3  justify-center md:justify-normal w-full px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl"
          >
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="hidden md:flex flex-col px-8 py-6 bg-white border-b border-slate-200 sticky z-10 top-0">
          <h1 className="text-lg font-bold text-slate-900">
            {pathname === "/admin" ? "Restaurants" : pathname === "/admin/bookingList" ? "Bookings" : "Dashboard"}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            System Management Center
          </p>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
