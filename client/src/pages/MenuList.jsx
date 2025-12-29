import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteMenuById,
  getAllCategories,
  getMenuList,
} from "../services/adminService";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { useConfirm } from "../context/ConfirmationContext";
import useDebounce from "../hooks/useDebounce";

function MenuList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [menulist, setMenuList] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortby, setSortBy] = useState("");

  const { confirm } = useConfirm();

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Menu?",
      message: "This action is permanent and cannot be undone.",
    });
    if (isConfirmed) {
      await deleteMenuById(id);
      getmenus();
    }
  };

  const getCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (e) {
      toast(e.ErrorMessage);
    }
  };

  const getmenus = async () => {
    const res = await getMenuList(
      currentpage,
      id,
      selectedCategory,
      sortby,
      searchTerm
    );
    setMenuList(res?.data?.data?.menuData);
    setTotalPages(res?.data?.data?.totalPages);
  };
  useEffect(() => {
    getmenus();
  }, [currentpage, sortby, searchTerm]);

  useEffect(() => {
    getCategories();
  }, []);
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
    menulist?.length > 0 || searchTerm !== "" || selectedCategory != null ? (<div className="w-full bg-white  text-black shadow-md rounded-xl p-4">
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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b">

        <div className="bg-white grid">
          <select
            id="sortby"
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-2 py-2 border rounded-lg">
            <option value="1">Sort by: Price (Des)</option>
            <option value="2">Sort by: Price (Asc)</option>
            <option value="3">Sort by: Name (A - Z)</option>
            <option value="4">Sort by: Name  (Z - A)</option>

          </select>
        </div>
        <div className="flex md:flex-row gap-4 flex-col">

          {/* <div className="flex items-center justify-center">
                        <p className="align-middle font-mono text-lg text-gray-600 font-bold mt-5">Filters : </p>
                    </div> */}
          <div>
            <select
              id="category"
              name="category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Category</option>
              {Array.isArray(categories) &&
                categories.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.categoryName}
                  </option>
                ))}
            </select>
          </div>
          {/* <div>
                        <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="number" id="date-range" name="date-range" onChange={(e) => setDate(e.target.value)} placeholder="Select date range"
                            className="mt-1 block w-full pl-3 border pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div> */}
          <div class="flex items-end">
            <button
              type="button"
              onClick={() => {
                getmenus();
              }}
              className="w-full md:w-auto px-4 py-2 border  rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center text-center justify-between gap-4 p-4">

        <div>
          <h2 className="text-xl font-semibold">Menu List</h2>
        </div>

        <div className="flex items-center md:items-center w-full md:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border w-full md:w-64 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

        </div>
      </div>

      <div className="overflow-x-auto">
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
                    <Link to={`/admin/editmenu/${r._id}`}>
                      <button className="p-2 rounded hover:bg-gray-100">
                        <PencilIcon className="size-6 text-orange-500" />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <TrashIcon className="size-6 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">
                  <div className="text-center py-20">
                    <FiFilter className="mx-auto mb-4" size={48} color="gray" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No Menu found
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

      {menulist.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            disabled={currentpage === 1}
            onClick={() => goToPrevpage()}
          >
            Previous
          </button>

          <div className="flex gap-2">
            <span>
              page {currentpage} of {totalPages}
            </span>
          </div>

          <button
            className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            disabled={currentpage === totalPages}
            onClick={() => goToNextPage()}
          >
            Next
          </button>
        </div>
      )}
    </div>
    ) : (
      <>
        <header className="border-b sticky top-0 z-10 px-4 py-2 flex items-center justify-between">
          <div className="flex text-orange-500 items-center">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-orange-500 hover:text-white rounded-full"
            >
              <FiArrowLeft size={20} />
            </button>
          </div>
          <Link
            to={`/admin/addmenu/${id}`}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg justify-items-end font-bold"
          >
            Add Menu
          </Link>
        </header>
        <div className="h-full flex text-gray-800 items-center justify-center">
          <div className="text-center py-20">
            <FiFilter className="mx-auto mb-4" size={48} color="gray" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Menu found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        </div>
      </>
    );
}

export default MenuList;
