import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, EyeClosed, EyeIcon } from "lucide-react";
import { MenuSquareIcon, NotebookPenIcon } from "lucide-react";
import { FiInbox, FiTrash2 } from "react-icons/fi";
import Highlighter from "react-highlight-words";
import toast from "react-hot-toast";
import { deleteRestaurantById, getAllRestaurants, updateRestaurantStatusById } from "../services/adminService";
import { useConfirm } from "../context/ConfirmationContext";

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
      message: "This action is permanent and cannot be undone.",
    });
    if (isConfirmed) {
      await deleteRestaurantById(id);
      toast.error("Restaurant removed successfully");
      restaurantList();
    }
  };

  const updateRestaurantStatus = async (id) => {
    try {
      await updateRestaurantStatusById(id);

      setRestaurant(prev =>
        prev.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r)
      );

      toast.success("Visibility status Changed");
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

  const restaurantList = async () => {
    const res = await getAllRestaurants(currentpage, searchTerm, sortby);
    setRestaurant(res?.data?.restaurants || []);
    setTotalPages(res?.data?.totalPages || 1);
  };

  useEffect(() => {
    restaurantList();
  }, [currentpage, searchTerm, sortby]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-500">Manage your partner outlets and their configurations.</p>
        </div>
        <Link
          to="add"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <PlusIcon size={18} />
          Add Restaurant
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Sort by:</span>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="1">Name (A-Z)</option>
            <option value="2">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className=" bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className=" w-full text-left border-collapse">
            <thead className="xl:table-header-group hidden">
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Menu</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Slots</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="xl:table-row-group grid grid-cols-1 gap-4 p-4 xl:p-0 xl:divide-y xl:divide-gray-200">
              {restaurant.length > 0 ? (
                restaurant.map((r) => (
                  <tr
                    key={r._id}
                    className="xl:table-row flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm xl:shadow-none xl:border-none hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 xl:border-none border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.logoImage}
                          className="h-12 w-12 xl:h-10 xl:w-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                          alt=""
                        />
                        <div className="flex flex-col">
                          <span className="font-bold xl:font-semibold text-gray-900 text-lg xl:text-base">
                            <Highlighter
                              highlightClassName="bg-yellow-100 text-yellow-800 rounded-sm"
                              searchWords={[searchTerm]}
                              autoEscape={true}
                              textToHighlight={r.name}
                            />
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3 flex flex-col xl:table-cell">
                      <span className="xl:hidden text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Contact Details</span>
                      <div className="text-sm text-gray-600 font-medium">{r.userId?.email}</div>
                      <div className="text-xs text-gray-400">{r.userId?.phone}</div>
                    </td>

                    <td className="px-6 py-4 xl:hidden border-t xl:border-none mt-auto">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-500">Management</span>

                        <div className="flex gap-2">
                          <Link to={`menu/${r._id}`} className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border xl:border-none border-indigo-100">
                            <NotebookPenIcon size={20} />
                          </Link>
                          <Link to={`slot/${r._id}`} className="inline-flex p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border xl:border-none border-emerald-100">
                            <MenuSquareIcon size={20} />
                          </Link>
                          <button
                            onClick={() => updateRestaurantStatus(r._id)}
                            className="inline-flex p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border xl:border-none border-orange-100">
                            {r.isActive ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 text-center">
                      <Link to={`menu/${r._id}`} className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <NotebookPenIcon size={20} />
                      </Link>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 text-center">
                      <Link to={`slot/${r._id}`} className="inline-flex p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <MenuSquareIcon size={20} />
                      </Link>
                    </td>
                    <td className="hidden xl:table-cell  px-6 py-4 text-center">
                      <button
                        onClick={() => updateRestaurantStatus(r._id)}
                        className="inline-flex p-2 text-orange-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        {r.isActive ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
                      </button>
                    </td>


                    <td className="px-6 py-3 xl:table-cell bg-gray-50/50 xl:bg-transparent rounded-b-xl xl:rounded-none border-t xl:border-none">
                      <div className="flex items-center justify-end space-x-3">
                        <span className="xl:hidden mr-auto text-sm font-medium text-gray-500">Settings</span>
                        <Link to={`add/${r._id}`} className="inline-flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          onClick={() => deleteRestaurant(r._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-24 xl:table-cell hidden items-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <FiInbox size={40} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No restaurants found</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">
                        {searchTerm ? "Adjust your search or filters to find what you're looking for." : "Start by adding your first restaurant to the platform."}
                      </p>
                    </div>
                  </td>

                  <div className="flex xl:hidden p-10 flex-col items-center justify-center text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <FiInbox size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No restaurants found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      {searchTerm ? "Adjust your search or filters to find what you're looking for." : "Start by adding your first restaurant to the platform."}
                    </p>
                  </div>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {restaurant.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{currentpage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentpage === 1}
                onClick={() => setcurrentpage(prev => prev - 1)}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeftIcon size={16} className="mr-1" /> Previous
              </button>
              <button
                disabled={currentpage === totalPages}
                onClick={() => setcurrentpage(prev => prev + 1)}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRightIcon size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurant;
