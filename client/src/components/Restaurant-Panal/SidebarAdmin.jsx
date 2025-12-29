import { NavLink } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { LogOut, Calendar, Utensils, CreditCard, Home } from "lucide-react";
import { useDispatch } from "react-redux";

function SidebarAdmin() {
  const dispatch = useDispatch();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mx-2 ${
      isActive
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
          <Utensils size={20} />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Restaurant<span className="text-orange-600">Panel</span>
          </span>
          <p className="text-xs text-gray-500 font-medium">Management</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <NavLink to="/restaurant/dashboard" className={navLinkClasses}>
          <Home size={18} />
          Dashboard
        </NavLink>

        <NavLink to="restaurant/booking" className={navLinkClasses}>
          <Calendar size={18} />
          Bookings
        </NavLink>

        <NavLink to="/admin/dashboard" className={navLinkClasses}>
          <Utensils size={18} />
          Menu Management
        </NavLink>

        <NavLink to="restaurant/bills" className={navLinkClasses}>
          <CreditCard size={18} />
          Billing & Bills
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default SidebarAdmin;
