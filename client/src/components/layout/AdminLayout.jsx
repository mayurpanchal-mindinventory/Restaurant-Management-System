import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { LogOut, LayoutDashboard, Utensils, CalendarCheck, Menu, X } from "lucide-react";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#f8fafc]">
      <div className="flex md:hidden items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 rounded-lg">
            <LayoutDashboard size={18} className="text-indigo-600" />
          </div>
          <span className="font-bold uppercase tracking-tight">AdminHub</span>
        </div>
        <button onClick={toggleMenu} className="p-2 text-slate-400 hover:text-white transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav
        className={`
          fixed  inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          flex flex-col min-h-full
          md:translate-x-0 md:fixed md:top-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="hidden md:flex items-center gap-3 p-8 border-b border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 bg-indigo-50 rounded-xl">
            <LayoutDashboard size={20} className="text-indigo-600" />
          </div>
          <span className="text-lg font-black uppercase">
            Admin<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        <div className="flex flex-col  p-4 gap-2 mt-20 md:mt-0 flex-grow">
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname === "/admin"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
          >
            <Utensils size={18} />
            <span>Restaurants</span>
          </Link>

          <Link
            to="/admin/bookingList"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname === "/admin/bookingList"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
          >
            <CalendarCheck size={18} />
            <span>Bookings</span>
          </Link>
        </div>

        <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0">
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 md:ml-72">
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
