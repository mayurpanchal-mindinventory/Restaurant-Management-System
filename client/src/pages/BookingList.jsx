import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteRestaurantById, getAllBooking, getAllRestaurants } from "../services/adminService";
import { MenuSquareIcon, NotebookPenIcon } from 'lucide-react'
import Loader from "../components/common/Loader";
function BookingList() {
    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(false);

    const bookingList = async () => {
        const res = await getAllBooking();
        setBooking(res);

    };
    useEffect(() => {
        bookingList();
    }, [])
    return (
        loading ? <Loader loading={loading} size={60} /> : (<div className="w-full bg-white  text-black shadow-md rounded-xl p-4">


            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full text-center">
                    <h2 className="text-xl font-semibold"> Booking List</h2>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border w-full md:w-64 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3">Restaurant</th>
                            <th className="p-3">Restaurant Name</th>
                            <th className="p-3">Username</th>
                            <th className="p-3">Slot Time</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {restaurant?.data?.map((r) => (

                            <tr key={r._id} className="border-b">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={r.logoImage}
                                            className="h-11 w-11 rounded-full border"
                                            alt="restaurant"
                                        />
                                        <span className="font-semibold">{r.name}</span>
                                    </div>
                                </td>

                                <td className="p-3">{r.userId.email}</td>
                                <td className="p-3">{r.userId.phone}</td>
                                <td className="p-3">{r?.openDays || "-"}</td>
                                <td className="p-3">
                                    <Link to={`menu/${r._id}`}>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <NotebookPenIcon className="size-6 text-orange-500" />
                                        </button>
                                    </Link>
                                </td>
                                <td className="p-3">
                                    <Link to={`slot/${r._id}`}>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <MenuSquareIcon className="size-6 text-orange-500" />
                                        </button>
                                    </Link>
                                </td>
                                <td className="p-3">
                                    <Link to={`add/${r._id}`}>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <PencilIcon className="size-6 text-orange-500" />
                                        </button>
                                    </Link>
                                    <button onClick={() => deleteRestaurant(r._id)} className="p-2 rounded hover:bg-gray-100">
                                        <TrashIcon className="size-6 text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
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

        </div >)
    );
}

export default BookingList;
