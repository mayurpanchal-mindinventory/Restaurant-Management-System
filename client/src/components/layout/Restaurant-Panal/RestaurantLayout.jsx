import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../Restaurant-Panal/SidebarAdmin";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

function RestaurantLayout() {
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden  lg:block sticky top-0 h-screen flex-shrink-0 border-r border-gray-200 ">
        <SidebarAdmin />
      </aside>
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 lg:hidden bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`w-64 h-full bg-white transform transition-transform duration- ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarAdmin />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2  text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Restaurant Panel
                </h1>
                <p className="hidden sm:block text-sm text-gray-600">
                  Welcome back, {user?.username || "Restaurant Owner"}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 text-right">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RestaurantLayout;
