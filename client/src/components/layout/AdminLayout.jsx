import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Outlet } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

const navigation = [
  { name: "Restaurants", href: "/admin", current: false },
  { name: "Bookings", href: "/admin/bookingList", current: false },
  // { name: "Slots", href: "slot", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout() {
  const dispatch = useDispatch();
  return (
    <div className="flex min-h-screen text-white">
      <Disclosure as="nav" className="w-64 bg-gray-800">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold hidden md:block">
                  Admin Panel
                </span>
              </div>

              <DisclosureButton className="md:hidden p-2 rounded hover:bg-gray-700">
                {open ? (
                  <XMarkIcon className="size-6" />
                ) : (
                  <Bars3Icon className="size-6" />
                )}
              </DisclosureButton>
            </div>

            <div className="hidden md:block px-3 py-4 space-y-1 ">
              {navigation.map((item) => (
                <Link
                  to={item.href}
                  key={item.name}
                  className={classNames(
                    item.current
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700",
                    "block rounded-md px-3 py-2 text-lg"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                dispatch(logout());
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        )}
      </Disclosure>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </header>

        <main className="p-6 bg-white w-full h-full">
          <div className="p-6 bg-gray-100 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
