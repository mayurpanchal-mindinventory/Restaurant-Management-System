import React from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Outlet } from "react-router-dom";

const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
    { name: "Restaurants", href: "#", current: true },
    { name: "Menus", href: "#", current: false },
    { name: "Bookings", href: "#", current: false },
];

const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen text-white">

            <Disclosure as="nav" className="w-64 bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                {/* <img
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                    className="size-8"
                                    alt="Logo"
                                /> */}
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

                        <div className="hidden md:block px-3 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-gray-700 text-white"
                                            : "text-gray-300 hover:bg-gray-700",
                                        "block rounded-md px-3 py-2 text-sm font-medium"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <DisclosurePanel className="md:hidden px-3 py-4 space-y-1">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-gray-700 text-white"
                                            : "text-gray-300 hover:bg-gray-700",
                                        "block rounded-md px-3 py-2 text-sm font-medium"
                                    )}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            <div className="flex-1 flex flex-col">

                <header className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-300 hover:text-white">
                            <BellIcon className="size-6" />
                        </button>

                        <Menu as="div" className="relative">
                            <MenuButton className="flex rounded-full">
                                <img
                                    src={user.imageUrl}
                                    className="size-9 rounded-full"
                                    alt="User"
                                />
                            </MenuButton>

                            <MenuItems className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                                {userNavigation.map((item) => (
                                    <MenuItem key={item.name}>
                                        {({ active }) => (
                                            <a
                                                href={item.href}
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-700"
                                                        : "",
                                                    "block px-4 py-2 text-sm text-gray-300"
                                                )}
                                            >
                                                {item.name}
                                            </a>
                                        )}
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                    </div>
                </header>

                <main className="p-6 bg-white w-full h-full">
                    <div className="">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
