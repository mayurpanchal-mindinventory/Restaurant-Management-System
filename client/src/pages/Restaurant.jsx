import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteRestaurantById, getAllRestaurants } from "../services/adminService";
import { MenuSquareIcon, NotebookPenIcon } from 'lucide-react'
import toast from "react-hot-toast";
import { useConfirm } from "../context/ConfirmationContext";
import { FiFilter } from "react-icons/fi";
import Highlighter from "react-highlight-words";
function Restaurant() {

    const { confirm } = useConfirm();
    const [restaurant, setRestaurant] = useState([]);
    const [currentpage, setcurrentpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortby, setSortBy] = useState("");

    const deleteRestaurant = async (id) => {
        const isConfirmed = await confirm({
            title: "Delete Restaurant?",
            message: "This action is permanent and cannot be undone."
        });
        if (isConfirmed) {
            const res = await deleteRestaurantById(id);
            restaurantList();
            toast.error("Restaurant Removed", {
                theme: "colored"
            });
            restaurantList();
        }
    };

    const restaurantList = async () => {
        const res = await getAllRestaurants(currentpage, searchTerm, sortby);
        setRestaurant(res?.data?.restaurants);
        setTotalPages(res?.data?.totalPages)
    };
    useEffect(() => {
        restaurantList();
    }, [currentpage, searchTerm, sortby])

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
    return (
        restaurant?.length > 0 || searchTerm !== "" ? (<div className="w-full bg-white  text-black shadow-md rounded-xl p-4">
            < div className="my-4 text-end">  <Link to={'add'} className="bg-gray-900 text-white px-4 py-2 rounded-lg  font-bold ">
                Add Restaurant
            </Link></div>

            <div className="flex md:flex-row gap-4 flex-col w-full justify-between mb-5 p-4  border-b">
                <div className="flex md:flex-row gap-4 flex-col justify-start items-center">
                    <div className="bg-white grid gap-2"> <select
                        id="sortby"
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 px-2 py-2 border rounded-lg">
                        <option value="1">Sort by: Name (A-Z)</option>
                        <option value="2">Sort by: Name (Z-A)</option>
                    </select>
                    </div>
                </div>
                {/* <div className="flex md:flex-row gap-4 flex-col justify-end">
                    <div className="flex items-center justify-center">
                        <p className="align-middle font-mono text-lg text-gray-600 font-bold mt-5">Filters : </p>
                    </div>
                    <div>
                        <label for="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" name="status"
                            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">All Statuses</option>
                            <option value="active">Accepted</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" id="date-range" name="date-range" placeholder="Select date range"
                            className="mt-1 block w-full pl-3 border pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div>
                    <div class="flex items-end">
                        <button type="button"
                            className="w-full md:w-auto px-4 py-2 border  rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Apply Filters
                        </button>
                    </div>
                </div> */}
            </div>

            <div className="flex flex-col md:flex-row w-full md:items-center md:justify-center gap-4">

                <div>
                    <h2 className="text-xl font-semibold "> Restaurants</h2>
                </div>

                <div className="flex items-center w-full md:w-auto">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        {restaurant.length > 0 ? (
                            restaurant?.map((r) => (

                                <tr key={r._id} className="border-b">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={r.logoImage}
                                                className="h-11 w-11 rounded-full border"
                                                alt="restaurant"
                                            />
                                            <span className="font-semibold">
                                                <Highlighter
                                                    highlightStyle={{
                                                        backgroundColor: '#ffd54f', // Custom yellow background
                                                        color: '#d32f2f',           // Red text color
                                                        fontWeight: 'bold',         // Bold matches
                                                        padding: '0 2px',           // Add spacing around match
                                                        borderRadius: '4px'         // Rounded corners
                                                    }}
                                                    searchWords={searchTerm ? [searchTerm] : []}
                                                    autoEscape={true}
                                                    textToHighlight={r.name}

                                                /></span>
                                        </div>
                                    </td>

                                    <td className="p-3">{r.userId.email}</td>
                                    <td className="p-3">{r.userId.phone}</td>
                                    <td className="p-3">{r?.openDays.length > 1 ? r.openDays : "-"} </td>
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
                            ))
                        ) : (<tr>
                            <td colSpan="7" className="p-10 text-center text-gray-500">
                                <div className="text-center py-20">
                                    <FiFilter className="mx-auto mb-4" size={48} color="gray" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        No Restaurant found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try adjusting your filters or search terms
                                    </p>
                                </div>
                            </td>
                        </tr>
                        )}
                    </tbody>


                </table>
            </div>

            {
                restaurant.length > 0 && <div className="flex justify-between items-center mt-4">
                    <button className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50" disabled={currentpage === 1} onClick={() => goToPrevpage()}>Previous</button>

                    <div className="flex gap-2">
                        <span>page {currentpage} of {totalPages}</span>
                    </div>

                    <button className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50" disabled={currentpage === totalPages} onClick={() => goToNextPage()}>Next</button>
                </div>
            }


        </div >) : (<>
            <div className="h-full flex text-gray-800 items-center justify-center">
                <p className="text-3xl font-bold">
                    No Restaurant Yet
                </p>
            </div>
        </>)
    );
}

export default Restaurant;
