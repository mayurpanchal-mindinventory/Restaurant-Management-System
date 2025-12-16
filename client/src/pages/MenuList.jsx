import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteMenuById, getMenuList } from "../services/adminService";
import { IndianRupee, MenuSquareIcon } from 'lucide-react'
import Menu from './Menu';

function MenuList() {

    const { id } = useParams();
    const [menulist, setMenuList] = useState([]);
    const getmenus = async () => {
        const res = await getMenuList(id);
        setMenuList(res.data);
    };
    useEffect(() => {
        getmenus();
    }, [])

    const deleteMenu = async (id) => {
        await deleteMenuById(id);
        getmenus();
    };
    return (
        <div className="w-full bg-white  text-black shadow-md rounded-xl p-4">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link to={`/admin/addmenu/${id}`} className="bg-gray-900 text-white px-4 py-2 rounded-lg justify-items-end font-bold">
                    Add Menu
                </Link>
                <div>
                    <h2 className="text-xl font-semibold">Menu List</h2>
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
                            <th className="p-3">Menu</th>
                            <th className="p-3">Menu Category</th>
                            <th className="p-3">Menu Item</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {menulist?.data?.map((r) => (

                            <tr key={r._id} className="border-b">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={r.image}
                                            className="h-11 w-11 rounded-full border"
                                            alt="restaurant"
                                        />
                                    </div>
                                </td>
                                <td className="p-3">{r?.categoryId.categoryName}</td>

                                <td className="p-3">{r?.name}</td>
                                <td className="p-3">Rs. {r?.price || "-"}</td>

                                <td className="p-3">
                                    <Link to={`/admin/editmenu/${r._id}`}>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <PencilIcon className="size-6 text-orange-500" />
                                        </button>
                                    </Link>

                                    <button onClick={() => deleteMenu(r._id)} className="p-2 rounded hover:bg-gray-100">
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

        </div>
    );
}

export default MenuList;
