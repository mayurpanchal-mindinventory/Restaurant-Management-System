import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";

function SidebarAdmin(params) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col w-64 h-screen p-5 bg-white shadow-xl ">
      <div className="flex items-center  gap-2">
        <div className="bg-orange-500 p-1.5 rounded-lg ">🍽️</div>
        <h1>
          FOODIE<span className="text-orange-500">HUB</span>
        </h1>
      </div>

      <aside className="flex mt-4 flex-col  h-full justify-between">
        <nav>
          <ul className="mt-5 pl-10 space-y-6">
            <li>
              <NavLink
                to="restaurant/booking"
                className="hover:text-orange-400 "
              >
                {" "}
                Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="" className="hover:text-orange-400">
                {" "}
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink to="" className="hover:text-orange-400">
                {" "}
                Billing
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
              <button
                onClick={() => {
                  dispatch(logout());
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default SidebarAdmin;
