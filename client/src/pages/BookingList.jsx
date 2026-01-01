import React, { useState, useEffect, useRef } from "react";
import { getAllBooking } from "../services/adminService";
import {
  FiCalendar,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
  FiClock,
} from "react-icons/fi";
import { PersonStanding, User2, Users, Users2 } from "lucide-react";

function BookingList() {
  const [booking, setBooking] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const isInitialMount = useRef(true);
  const [sortby, setSortBy] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const prevStatusRef = useRef("");
  const prevDateRef = useRef("");
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Accepted: "bg-blue-100 text-blue-700 border border-blue-300",
    Completed: "bg-green-100 text-green-700 border border-green-300",
    Cancelled: "bg-red-100 text-red-700 border border-red-300",
  };

  const bookingList = async (sr = sortby, s = status, d = date) => {
    const res = await getAllBooking(currentpage, searchTerm, sr, s, d);
    setBooking(res?.data?.booking || []);
    setTotalPages(res?.data?.totalPages || 1);

    prevStatusRef.current = s;
    prevDateRef.current = d;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setcurrentpage(1);
      const debouncedSearch = setTimeout(() => {
        bookingList();
      }, 500);

      return () => clearTimeout(debouncedSearch);
    }
  }, [searchTerm, sortby]);

  useEffect(() => {
    bookingList();
  }, [currentpage]);

  const clearfilter = () => {
    if (prevStatusRef.current !== "" || prevDateRef.current !== "") {
      setStatus("");
      setDate("");
      setSortBy("");
      bookingList("", "", "");
    }
  };
  const goToNextPage = () => {
    if (currentpage < totalPages) setcurrentpage(currentpage + 1);
  };

  const goToPrevpage = () => {
    if (currentpage > 1) setcurrentpage(currentpage - 1);
  };

  return booking.length > 0 ||
    searchTerm !== "" ||
    date != "" ||
    status != null ||
    totalPages > 1 ? (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b">
        <div className="bg-white grid gap-2">
          <select
            id="sortby"
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-2 py-2 border rounded-lg"
          >
            <option value="">Sort by: Created At</option>
            <option value="1">Sort by: Booking Date</option>
            <option value="2">Sort by: Restaurant (A-Z)</option>
            <option value="3">Sort by: Restaurant (Z-A)</option>
          </select>
        </div>
        <div className="flex md:flex-row gap-4 flex-col">
          {/* <div className="flex items-center justify-center">
            <p className="align-middle font-mono text-lg text-gray-600 font-bold mt-5">Filters : </p>
          </div> */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="date-range"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date-range"
              name="date-range"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Select date range"
              className="mt-1 block w-full pl-3 border pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (
                  prevStatusRef.current !== status ||
                  prevDateRef.current !== date
                )
                  bookingList();
              }}
              className="w-full md:w-auto px-4 py-2 border  rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => clearfilter({})}
              className="w-full md:w-auto px-4 py-2  rounded-md shadow-sm text-sm font-medium text-gray-600   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-white text-black shadow-md rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full">
            <h2 className="text-xl font-semibold"> Booking List</h2>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, user, or status..."
              className="border w-full md:w-64 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Slot Time
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {booking.length > 0 ? (
                booking.map((r) => (
                  <tr key={r._id} className="border-b">
                    <td className="p-3">
                      {r?.date
                        ? new Date(r.date).toLocaleString().split(",")[0]
                        : "Date is not available"}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            r?.restaurantId?.logoImage
                              ? r.restaurantId.logoImage
                              : "https://placehold.co/800?text=logo&font=roboto"
                          }
                          className="h-11 w-11 rounded-full border"
                          alt="restaurant"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-none">
                          {r?.userId?.name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">
                          Verified User
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-slate-600 font-mono text-xs bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                        <Users size={12} className="text-slate-400" />
                        {r?.numberOfGuests || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-slate-600 font-mono text-xs bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                        <FiClock size={12} className="text-slate-400" />
                        {r?.timeSlotId?.timeSlot || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <span
                          className={`px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                            statusStyles[r?.status] ||
                            "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {r?.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    <div className="text-center py-20">
                      <FiFilter
                        className="mx-auto mb-4"
                        size={48}
                        color="gray"
                      />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No items found
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
        {booking.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button
              className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              disabled={currentpage === 1}
              onClick={goToPrevpage}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentpage} of {totalPages}
            </span>
            <button
              className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              disabled={currentpage === totalPages}
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  ) : (
    <div className="text-center py-20">
      <FiFilter className="mx-auto mb-4" size={48} color="gray" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No Booking found
      </h3>
      <p className="text-gray-500">
        Try adjusting your filters or search terms
      </p>
    </div>
  );
}

export default BookingList;
