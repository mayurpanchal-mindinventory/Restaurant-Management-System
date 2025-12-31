import React, { useState, useEffect, useRef } from "react";
import { getAllBooking } from "../services/adminService";
import {
  FiFilter, FiCalendar, FiSearch, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiUser, FiClock, FiMapPin
} from "react-icons/fi";

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
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
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
    setStatus("");
    setDate("");
    setSortBy("");
    setSearchTerm("");
    bookingList("", "", "");
  };

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reservations</h1>
            <p className="text-slate-500 text-sm font-medium">Manage and track your restaurant bookings in real-time.</p>
          </div>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer or restaurant..."
              className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="p-2 border-r border-slate-100 last:border-0">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Sort Order</label>
              <select
                value={sortby}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="">Recently Created</option>
                <option value="1">Reservation Date</option>
                <option value="2">Restaurant (A-Z)</option>
              </select>
            </div>

            <div className="p-2 border-r border-slate-100 last:border-0">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Booking Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Accepted">Accepted</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="p-2 border-r border-slate-100 last:border-0">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Selected Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
              />
            </div>

            <div className="p-2 flex items-center gap-2">
              <button
                onClick={() => bookingList()}
                className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Apply Filters
              </button>
              <button
                onClick={clearfilter}
                className="p-2.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reservation Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Timing</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {booking.length > 0 ? (
                  booking.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{item?.userId?.name || "Guest User"}</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <FiCalendar className="w-3 h-3" />
                            {item?.date ? new Date(item.date).toLocaleDateString('en-GB') : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden shadow-sm">
                            <img
                              src={item?.restaurantId?.logoImage || "ui-avatars.com"}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900 leading-none">{item?.restaurantId?.name || "Unknown"}</span>
                            <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                              <FiMapPin size={10} /> Partner Outlet
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          <FiClock className="text-slate-400 w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-slate-700 font-mono tracking-tight">
                            {item?.timeSlotId?.timeSlot || "--:--"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`min-w-[100px] text-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${statusStyles[item?.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            {item?.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-32 text-center">
                      <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                          <FiFilter className="text-slate-300 w-8 h-8" />
                        </div>
                        <h3 className="text-slate-900 font-bold">No Records Found</h3>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                          We couldn't find any bookings matching your current criteria. Try adjusting your filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {booking.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing Page <span className="text-indigo-600">{currentpage}</span> of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentpage === 1}
                  onClick={() => setcurrentpage(prev => prev - 1)}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  <FiChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  disabled={currentpage === totalPages}
                  onClick={() => setcurrentpage(prev => prev + 1)}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  <FiChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingList;
