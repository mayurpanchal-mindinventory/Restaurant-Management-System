import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { deleteMenuById, getMenuList, getRestaurantMenu } from '../../services/adminService';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useConfirm } from '../../context/ConfirmationContext';

function MenuByRestaurant() {

    const { user } = useSelector((state) => state.auth);
    const userId = user?.id || user?._id;
    const [menulist, setMenuList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setcurrentpage] = useState(1);
    const { confirm } = useConfirm();

    const getmenus = async () => {
        const res = await getRestaurantMenu(currentPage, userId);
        setMenuList(res?.data?.data?.menuData);
        setTotalPages(res?.data?.data?.totalPages)
    };
    useEffect(() => {
        getmenus();
    }, [currentPage])
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setcurrentpage(currentPage + 1);
        }
    };

    const goToPrevpage = () => {
        if (currentPage > 1) {
            setcurrentpage(currentPage - 1);
        }
    };
    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: "Delete Menu?",
            message: "This action is permanent and cannot be undone."
        });
        if (isConfirmed) {
            await deleteMenuById(id);
            getmenus();
        }
    };
    return (

        <div className="container mx-auto p-4">
            <div className="mb-6">


            </div>
            <div className="w-full bg-white text-black shadow-md rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="w-full text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Restaurant Menu's
                        </h1>                    </div>
                </div>

                {menulist?.length > 0 ? (
                    <>
                        <header className=" border-b sticky top-0 z-10 px-4 py-2 flex items-center justify-between">
                            <Link to={`/restaurant/addmenu/${menulist[0]?.restaurantId?._id}`} className="bg-orange-500 text-white px-4 py-2 rounded-lg justify-items-end font-bold">
                                Add Menu
                            </Link>
                        </header>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-base font-extrabold">
                                        <th className="p-3">Menu</th>
                                        <th className="p-3">Menu Category</th>
                                        <th className="p-3">Menu Item</th>
                                        <th className="p-3">Price</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {menulist.length > 0 ? (
                                        menulist?.map((r) => (

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
                                                    <Link to={`/restaurant/editmenu/${r._id}`}>
                                                        <button className="p-2 rounded hover:bg-gray-100">
                                                            <PencilIcon className="size-6 text-orange-500" />
                                                        </button>
                                                    </Link>

                                                    <button onClick={() => handleDelete(r._id)} className="p-2 rounded hover:bg-gray-100">
                                                        <TrashIcon className="size-6 text-red-500" />
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr>
                                        <td colSpan="3" className="p-10 text-center text-gray-500">
                                            No matching menu found on this page.
                                        </td>
                                    </tr>)}
                                </tbody>

                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                className="border px-4 py-2 rounded-lg text-sm"
                                disabled={currentPage === 1}
                                onClick={goToPrevpage}
                            >
                                Previous
                            </button>
                            <div className="flex gap-2">
                                <span>
                                    page {currentPage} of {totalPages}
                                </span>
                            </div>
                            <button
                                className="border px-4 py-2 rounded-lg text-sm"
                                disabled={currentPage === totalPages}
                                onClick={goToNextPage}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex text-gray-800 items-center justify-center">
                        <p className="text-3xl font-bold">No Menu  Yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MenuByRestaurant