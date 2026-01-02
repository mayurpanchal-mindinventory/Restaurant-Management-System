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
  const prevSortByRef = useRef("");
  const statusStyles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const bookingList = async (sr = sortby, s = status, d = date) => {
    if (prevStatusRef.current !== status || prevDateRef.current != date) {
      setcurrentpage(1);
    }
    const res = await getAllBooking(currentpage, searchTerm, sr, s, d);
    setBooking(res?.data?.booking || []);
    setTotalPages(res?.data?.totalPages || 1);
    prevSortByRef.current = sr;
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Booking List
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage and monitor customer reservations.
          </p>
        </div>

        <div className="">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, user, or status..."
            className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1  lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
              Sort Results
            </label>
            <select
              id="sortby"
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border-none text-slate-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            >
              <option value="">Created At</option>
              <option value="1">Booking Date</option>
              <option value="2">Restaurant (A-Z)</option>
              <option value="3">Restaurant (Z-A)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              className="w-full bg-slate-50 border-none text-slate-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            >
              <option value="">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
              Filter Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                id="date-range"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 bg-slate-50 border-none text-slate-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>
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
              className="flex-1 bg-slate-900 text-white text-xs font-bold py-3 rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={clearfilter}
              className="p-3 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
            <tbody className="divide-y divide-slate-100">
              {booking.length > 0 ? (
                booking.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                      {r?.date
                        ? new Date(r.date).toLocaleString().split(",")[0]
                        : "Date unavailable"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            r?.restaurantId?.logoImage ||
                            "https://placehold.co/400"
                          }
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                          alt="logo"
                        />
                        <span className="text-sm font-bold text-slate-900">
                          {r?.restaurantId?.name || "Restaurant Removed"}
                        </span>
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
                  <td colSpan="5" className="py-24">
                    <div className="flex flex-col items-center justify-center text-center max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <FiInbox className="text-slate-300" size={32} />
                      </div>
                      <h3 className="text-slate-900 font-bold">
                        No Bookings found
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        Try adjusting your filters or search terms to find what
                        you're looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {booking.length > 0 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Page <span className="text-indigo-600">{currentpage}</span> of{" "}
              {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentpage === 1}
                onClick={goToPrevpage}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
              >
                <FiChevronLeft /> Prev
              </button>
              <button
                disabled={currentpage === totalPages}
                onClick={goToNextPage}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingList;
