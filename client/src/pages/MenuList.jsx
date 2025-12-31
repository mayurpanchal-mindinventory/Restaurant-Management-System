import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FiArrowLeft, FiFilter, FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";
import { deleteMenuById, getAllCategories, getMenuList } from "../services/adminService";
import { useConfirm } from "../context/ConfirmationContext";
import { toast } from "react-hot-toast";

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

  const getmenus = async () => {
    try {
      const res = await getMenuList(currentpage, id, selectedCategory, sortby, searchTerm);
      setMenuList(res?.data?.data?.menuData || []);
      setTotalPages(res?.data?.data?.totalPages || 1);
    } catch (e) {
      toast.error("Failed to load menu");
    }
  };

  const handleDelete = async (menuId) => {
    const isConfirmed = await confirm({
      title: "Delete Item?",
      message: "Are you sure? This item will be removed from the digital menu.",
    });
    if (isConfirmed) {
      await deleteMenuById(menuId);
      toast.success("Item removed");
      getmenus();
    }
  };

  useEffect(() => {
    getmenus();
  }, [currentpage, sortby, searchTerm]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await getAllCategories();
      setCategories(res.data);
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu Catalog</h1>
              <p className="text-sm text-gray-500">Manage items, prices, and categories for this outlet.</p>
            </div>
          </div>
          <Link
            to={`/admin/addmenu/${id}`}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
          >
            <FiPlus /> Add New Item
          </Link>
        </div>

        {/* Professional Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Search Item</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) && categories.map((a) => (
                <option key={a._id} value={a._id}>{a.categoryName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sort By</label>
            <select
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="1">Price: High to Low</option>
              <option value="2">Price: Low to High</option>
              <option value="3">Name: A-Z</option>
              <option value="4">Name: Z-A</option>
            </select>
          </div>

          <button
            onClick={getmenus}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            <FiRefreshCw className="text-indigo-400" /> Apply
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dish</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {menulist.length > 0 ? (
                  menulist.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={r.image || "placehold.co"}
                            className="h-12 w-12 rounded-xl object-cover border border-gray-200 shadow-sm ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                            alt={r.name}
                          />
                          <span className="font-bold text-gray-900">{r?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-black uppercase border border-indigo-100">
                          {r?.categoryId.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-700">
                        ₹{r?.price || "0"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/editmenu/${r._id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-24">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="bg-gray-50 p-5 rounded-full mb-4">
                          <FiFilter className="text-gray-300" size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No items found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-[250px]">
                          Try adjusting your search or category filters to find what you need.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {menulist.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Page {currentpage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentpage === 1}
                  onClick={() => setcurrentpage(prev => prev - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                  Previous
                </button>
                <button
                  disabled={currentpage === totalPages}
                  onClick={() => setcurrentpage(prev => prev + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuList;
