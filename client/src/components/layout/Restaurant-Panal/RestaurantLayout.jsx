import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../Restaurant-Panal/SidebarAdmin";
import { useSelector } from "react-redux";

function RestaurantLayout() {
  const { user } = useSelector((state) => state.auth);
  {
    console.log(user);
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="sticky top-0 h-screen flex-shrink-0 border-r border-gray-200">
        <SidebarAdmin />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Restaurant Panel
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.username || "Restaurant Owner"}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RestaurantLayout;
