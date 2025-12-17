import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteRestaurantById, getAllRestaurants } from "../services/adminService";
import { MenuSquareIcon, NotebookPenIcon } from 'lucide-react'
import Loader from "../components/common/Loader";
function Restaurant() {
    const [restaurant, setRestaurant] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentpage, setcurrentpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const restaurantList = async () => {
        const res = await getAllRestaurants(currentpage);
        setRestaurant(res?.data?.restaurants);
        setTotalPages(res?.data?.totalPages)
    };
    useEffect(() => {
        restaurantList();
    }, [currentpage])

    const goToNextPage = () => {
        if (currentpage < totalPages) {
            setcurrentpage(currentpage + 1);
        }
    };

    const goToPrevpage = () => {
        if (currentpage > 1) {
            setcurrentpage(currentpage - 1);
        }
    };
    const deleteRestaurant = async (id) => {
        setLoading(true)
        const res = await deleteRestaurantById(id);
        // if (res.status === 401) {
        //     logout();
        //     return;
        // }

        toast.error("Restaurant Removed", {
            theme: "colored"
        });
        restaurantList();
        setLoading(false);
    };
    return (
        loading ? <Loader loading={loading} size={40} /> : (<div className="w-full bg-white  text-black shadow-md rounded-xl p-4">


            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link to={'add'} className="bg-gray-900 text-white px-4 py-2 rounded-lg  justify-items-end font-bold ">
                    Add Restaurant
                </Link>
                <div>
                    <h2 className="text-xl font-semibold"> Restaurants</h2>
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
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Close Day</th>
                            <th className="p-3">Menu</th>
                            <th className="p-3">Slots</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {restaurant?.map((r) => (

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
                <button className="border px-4 py-2 rounded-lg text-sm" disabled={currentpage === 1} onClick={() => goToPrevpage()}>Previous</button>

                <div className="flex gap-2">
                    <span>page {currentpage} of {totalPages}</span>
                </div>

                <button className="border px-4 py-2 rounded-lg text-sm" disabled={currentpage === totalPages} onClick={() => goToNextPage()}>Next</button>
            </div>


        </div >)
    );
}

export default Restaurant;
