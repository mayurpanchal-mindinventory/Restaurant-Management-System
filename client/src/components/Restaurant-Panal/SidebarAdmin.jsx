import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

function SidebarAdmin(params) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-64 h-screen p-5 bg-white shadow-xl ">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-semibold text-orange-500  ">Restaurant</h1>
      </div>

      <aside className="flex mt-4 flex-col h-full justify-between">
        <nav>
          <ul className="space-y-3">
            <li>
              <NavLink to="" className="hover:text-orange-400">
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
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"></div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default SidebarAdmin;
