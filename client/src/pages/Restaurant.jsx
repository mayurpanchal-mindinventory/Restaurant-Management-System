import { PencilIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

function Restaurant() {
    return (
        <div className="w-full bg-white  text-black shadow-md rounded-xl p-4">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Recent Restaurants</h2>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border w-full md:w-64 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                    <Link to={'add'} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">
                        Add Restaurant
                    </Link>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3">Restaurant</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Account</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>

                    <tbody className="text-black">
                        <tr className="border-b">
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://docs.material-tailwind.com/img/logos/logo-netflix.svg"
                                        className="h-10 w-10 rounded-full border p-1"
                                        alt="netflix"
                                    />
                                    <span className="font-semibold">Netflix</span>
                                </div>
                            </td>

                            <td className="p-3">$14,000</td>
                            <td className="p-3">Wed 3:30am</td>

                            <td className="p-3">
                                <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-bold uppercase">
                                    Cancelled
                                </span>
                            </td>

                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/visa.png"
                                        className="h-8 w-12 object-contain border rounded"
                                        alt="visa"
                                    />
                                    <div>
                                        <p className="font-medium">Visa 1234</p>
                                        <p className="text-gray-500 text-xs">06/2026</p>
                                    </div>
                                </div>
                            </td>

                            <td className="p-3 text-right">
                                <button className="p-2 rounded hover:bg-gray-100">
                                    <PencilIcon />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button className="border px-4 py-2 rounded-lg text-sm">Previous</button>

                <div className="flex gap-2">
                    {[1, 2, 3, "...", 8, 9, 10].map((n, i) => (
                        <button
                            key={i}
                            className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <button className="border px-4 py-2 rounded-lg text-sm">Next</button>
            </div>

        </div>
    );
}

export default Restaurant;
