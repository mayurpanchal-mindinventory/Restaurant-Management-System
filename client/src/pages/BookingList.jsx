import React, { useState, useEffect, useRef } from "react";
import { getAllBooking } from "../services/adminService";

function BookingList() {
  const [booking, setBooking] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const isInitialMount = useRef(true);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Accepted: "bg-blue-100 text-blue-700 border border-blue-300",
    Completed: "bg-green-100 text-green-700 border border-green-300",
    Cancelled: "bg-red-100 text-red-700 border border-red-300",
  };

  const bookingList = async () => {
    const res = await getAllBooking(currentpage, searchTerm);
    setBooking(res?.data?.booking || []);
    setTotalPages(res?.data?.totalPages || 1);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const debouncedSearch = setTimeout(() => {
        bookingList();
      }, 1500);

      return () => clearTimeout(debouncedSearch)
    }
  }, [searchTerm]);

  useEffect(() => {
    bookingList();
  }, [currentpage])
  // const filteredBookings = booking.filter((item) => {
  //   const searchStr = searchTerm.toLowerCase();
  //   return (
  //     item?.restaurantId?.name?.toLowerCase().includes(searchStr) ||
  //     item?.userId?.name?.toLowerCase().includes(searchStr) ||
  //     item?.status?.toLowerCase().includes(searchStr)
  //   );
  // });

  const goToNextPage = () => {
    if (currentpage < totalPages) setcurrentpage(currentpage + 1);
  };

  const goToPrevpage = () => {
    if (currentpage > 1) setcurrentpage(currentpage - 1);
  };

  return booking.length > 0 || searchTerm !== "" ? (
    <div className="w-full bg-white text-black shadow-md rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full text-center">
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
            <tr className="bg-gray-100 text-gray-700 text-base font-extrabold">
              <th className="p-3">Date</th>
              <th className="p-3">Restaurant</th>
              <th className="p-3">Restaurant Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Slot Time</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {booking.length > 0 ? (
              booking.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="p-3">{r?.date ? new Date(r.date).toLocaleString().split(',')[0] : "Date is not available"}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={r?.restaurantId?.logoImage ? r.restaurantId.logoImage : "https://placehold.co/800?text=logo&font=roboto"}
                        className="h-11 w-11 rounded-full border"
                        alt="restaurant"
                      />
                    </div>
                  </td>
                  <td className="p-3">{r?.restaurantId?.name || "Restaurant Removed"}</td>
                  <td className="p-3">{r?.userId?.name}</td>
                  <td className="p-3">{r?.timeSlotId?.timeSlot || "-"}</td>
                  <td className="p-3">
                    <p className={`w-fit px-4 py-1 text-center rounded-full text-xs font-medium ${statusStyles[r?.status] || "bg-gray-100 text-gray-700"}`}>
                      {r?.status}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">
                  No matching bookings found on this page.
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
    </div>
  ) : (
    <div className="h-full flex text-gray-800 items-center justify-center">
      <p className="text-3xl font-bold">No Booking Yet</p>
    </div>
  );
}

export default BookingList;
