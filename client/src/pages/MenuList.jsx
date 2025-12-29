import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMenuById, getMenuList } from "../services/adminService";
import { FiArrowLeft } from "react-icons/fi";
import { useConfirm } from "../context/ConfirmationContext";
import useDebounce from "../hooks/useDebounce";

function MenuList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [menulist, setMenuList] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
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
  const filteredMenu = menulist.filter((item) => {
    const searchStr = debouncedSearchTerm.toLowerCase();
    return (
      item?.categoryId?.categoryName.toLowerCase().includes(searchStr) ||
      item?.name.toLowerCase().includes(searchStr)
    );
  });
  const getmenus = async () => {
    const res = await getMenuList(currentpage, id);
    setMenuList(res?.data?.data?.menuData);
    setTotalPages(res?.data?.data?.totalPages);
  };
  useEffect(() => {
    getmenus();
  }, [currentpage]);

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
  return menulist?.length > 0 || searchTerm !== "" ? (
    <div className="w-full bg-white  text-black shadow-md rounded-xl p-4">
      <header className=" border-b sticky top-0 z-10 px-4 py-2 flex items-center justify-between">
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
      <div className="flex flex-col md:flex-row md:items-center mt-2 justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Menu List</h2>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
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
              <th className="p-3">Menu</th>
              <th className="p-3">Menu Category</th>
              <th className="p-3">Menu Item</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {filteredMenu.length > 0 ? (
              filteredMenu?.map((r) => (
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
                <td colSpan="3" className="p-10 text-center text-gray-500">
                  No matching menu found on this page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        <p className="text-3xl font-bold">No Menu Yet</p>
      </div>
    </>
  );
}

export default MenuList;
