import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantMenu, deleteMenuById } from "../../services/adminService";
import { Link } from "react-router-dom";
import { useConfirm } from "../../context/ConfirmationContext";
import {
  UtensilsCrossed,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Tag,
  Image as ImageIcon,
} from "lucide-react";

function MenuByRestaurant() {
  const userIdFromLocal = localStorage.getItem("user");
  const userJson = JSON.parse(userIdFromLocal);

  console.log(userJson?.user?.id);

  const userId = userJson?.user?.id;
  const [menulist, setMenuList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setcurrentpage] = useState(1);
  const { confirm } = useConfirm();

  const getmenus = async () => {
    const res = await getRestaurantMenu(currentPage, userId);
    setMenuList(res?.data?.data?.menuData || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };




  useEffect(() => {
    getmenus();
  }, [currentPage]);

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

  const totalMenuItems = menulist.length;
  const averagePrice =
    menulist.length > 0
      ? menulist.reduce((sum, item) => sum + (item.price || 0), 0) /
      menulist.length
      : 0;
  const categoriesCount = new Set(
    menulist.map((item) => item?.categoryId?.categoryName)
  ).size;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Menu Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage your restaurant items
            </p>
          </div>
        </div>

        {menulist?.length > 0 && (
          <Link
            to={`/restaurant/addmenu/${menulist[0]?.restaurantId?._id}`}
            className="flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <Plus size={18} />
            Add Menu Item
          </Link>
        )}
      </div>

      {/* Stats Section - Minimal Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Items",
            value: totalMenuItems,
            icon: UtensilsCrossed,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Categories",
            value: categoriesCount,
            icon: Tag,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Avg. Price",
            value: `₹${averagePrice.toFixed(0)}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div
              className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section - Clean & Minimal */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden xl:table-row-group">
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Image
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Item Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">
                  Category
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Price
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="xl:table-row-group hidden divide-y divide-gray-50">
              {menulist.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-500 font-medium">
                      {item?.categoryId?.categoryName || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/restaurant/editmenu/${item._id}`}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="xl:hidden grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50/50">
            {menulist.length > 0 ? (
              menulist.map((r) => (
                <div key={r._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={r.image || "placehold.co"}
                      className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                      alt={r.name}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{r?.name}</h4>
                        <span className="font-bold text-gray-900">₹{r?.price || "0"}</span>
                      </div>
                      <span className="mt-1 inline-block  text-sm text-gray-500 font-medium">
                        {r?.categoryId.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-50 pt-3">
                    <Link
                      to={`/restaurant/editmenu/${r._id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">No items found</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setcurrentpage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setcurrentpage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuByRestaurant;
