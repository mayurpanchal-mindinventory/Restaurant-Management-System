import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMenuById, getMenuList } from "../services/adminService";
import { FiArrowLeft } from "react-icons/fi";

function MenuList() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [menulist, setMenuList] = useState([]);
    const [currentpage, setcurrentpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const getmenus = async () => {
        const res = await getMenuList(currentpage, id);

        setMenuList(res?.data?.data?.menuData);
        setTotalPages(res?.data?.data?.totalPages)

    };
    useEffect(() => {
        getmenus();
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
    const deleteMenu = async (id) => {
        await deleteMenuById(id);
        getmenus();
    };
    return (
        menulist?.length > 0 ? (<div className="w-full bg-white  text-black shadow-md rounded-xl p-4">
            <header className=" border-b sticky top-0 z-10 px-4 py-2 flex items-center justify-between">
                <div className="flex text-orange-500 items-center">
                    <button type="button" onClick={() => navigate('/admin')} className="p-2 hover:bg-orange-500 hover:text-white rounded-full">
                        <FiArrowLeft size={20} />
                    </button>
                </div>
                <Link to={`/admin/addmenu/${id}`} className="bg-gray-900 text-white px-4 py-2 rounded-lg justify-items-end font-bold">
                    Add Menu
                </Link>
            </header>
            <div className="flex flex-col md:flex-row md:items-center mt-2 justify-between gap-4">

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
                        {menulist?.map((r) => (

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
                <button className="border px-4 py-2 rounded-lg text-sm" disabled={currentpage === 1} onClick={() => goToPrevpage()}>Previous</button>

                <div className="flex gap-2">
                    <span>page {currentpage} of {totalPages}</span>
                </div>

                <button className="border px-4 py-2 rounded-lg text-sm" disabled={currentpage === totalPages} onClick={() => goToNextPage()}>Next</button>
            </div>

        </div>) : (<><header className="border-b sticky top-0 z-10 px-4 py-2 flex items-center justify-between">
            <div className="flex text-orange-500 items-center">
                <button type="button" onClick={() => navigate('/admin')} className="p-2 hover:bg-orange-500 hover:text-white rounded-full">
                    <FiArrowLeft size={20} />
                </button>
            </div>
            <Link to={`/admin/addmenu/${id}`} className="bg-gray-900 text-white px-4 py-2 rounded-lg justify-items-end font-bold">
                Add Menu
            </Link>
        </header>
            <div className="h-full flex text-gray-800 items-center justify-center">
                <p className="text-3xl font-bold">
                    No Categories Yet
                </p>
            </div></>)
    );
}

export default MenuList;
