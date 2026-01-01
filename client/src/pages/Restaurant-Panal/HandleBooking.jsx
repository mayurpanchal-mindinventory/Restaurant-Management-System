import {
  ChevronDown,
  Calendar,
  Clock,
  Users,
  FileText,
  Search,
  Filter,
  Check,
} from "lucide-react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  getBookingsByRestaurantId,
  updateBookingStatus,
} from "../../services/restaurantPanelService";
import { useSelector } from "react-redux";
import { useToast } from "../../components/common/ToastProvider";
import BillGeneration from "../../components/Restaurant-Panel/BillGeneration";

function HanldeBooking(params) {
  const [dataList, setdataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [ss, setss] = useState("");
  const [showBillGeneration, setShowBillGeneration] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalrecord, setTotalrecord] = useState(0);
  const [countStatus, setCountStatus] = useState({
    totalPending: "",
    totalCompleted: "",
  });
  const [tempFilters, setTempFilters] = useState({
    search: "",
    date: "",
    status: "",
    timeslot: "",
  });
  const [bookings, setBookings] = useState([]);

  // Toast notification hook
  const { showSuccess, showError, showInfo } = useToast();

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setss(newStatus);
      showSuccess(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error("Failed to update status", error);
      showError("Failed to update booking status");
    }
  };

  const handleGenerateBill = (booking) => {
    setSelectedBooking(booking);
    setShowBillGeneration(true);
  };

  const handleBillCreated = (newBill) => {
    console.log("Bill created:", newBill);
    showSuccess("Bill generated successfully!");

    // Refresh the booking list to update bill generation status
    fetchBookingById();
  };

  const handleToastMessage = (message, type) => {
    if (type === "success") {
      showSuccess(message);
    } else if (type === "error") {
      showError(message);
    } else {
      showInfo(message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBookingById();
    }
  }, [user?.id, ss, currentpage]);

  const goToNextPage = () => {
    if (currentpage < totalPages) setcurrentpage(currentpage + 1);
  };

  const goToPrevpage = () => {
    if (currentpage > 1) setcurrentpage(currentpage - 1);
  };

  const fetchBookingById = async (filtersToUse = tempFilters) => {
    try {
      setLoading(true);
      const result = await getBookingsByRestaurantId(
        user.id,
        currentpage,
        filtersToUse
      );
      setdataList(result?.booking || []);

      setTotalPages(result?.totalPages || 1);
      setTotalrecord(result?.totalDocs);
      setCountStatus({
        totalCompleted: result?.totalPending,
        totalPending: result?.totalCompleted,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setdataList([]);
      showError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = () => {
    fetchBookingById();
  };

  const handleResetClick = () => {
    const empty = { search: "", date: "", status: "", timeslot: "" };
    setTempFilters(empty);

    fetchBookingById(empty);
  };

  // Check if a booking has already generated a bill
  const isBillGenerated = (booking) => {
    return booking.hasGeneratedBill || false;
  };

  // Get button text based on bill generation status
  const getGenerateBillButtonText = (booking) => {
    return isBillGenerated(booking) ? "Bill Generated" : "Generate Bill";
  };

  // Get button style based on bill generation status
  const getGenerateBillButtonStyle = (booking) => {
    const baseStyle =
      "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded transition-colors";

    if (isBillGenerated(booking)) {
      return `${baseStyle} bg-gray-400 text-white cursor-not-allowed`;
    }

    return `${baseStyle} bg-blue-600 text-white hover:bg-blue-700`;
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Booking Management
            </h1>
            <p className="text-sm text-gray-600">
              Manage restaurant reservations and bookings
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalrecord}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {countStatus.totalPending}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {countStatus.totalCompleted}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bills Generated
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dataList.filter((b) => b.hasGeneratedBill).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* filtering  */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex items-center gap-3">
          {/* Search */}
          <div className="flex-grow relative lg:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="search"
              type="text"
              placeholder="Search name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 outline-none"
              value={tempFilters.search}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              name="date"
              type="date"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 outline-none"
              value={tempFilters.date}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              name="status"
              className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:border-orange-500 outline-none"
              value={tempFilters.status}
              onChange={handleChange}
            >
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Apply Button - THE TRIGGER */}
          <button
            onClick={handleApplyClick}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 transition-all shadow-sm active:scale-95"
          >
            <Check size={16} />
            Apply Filters
          </button>

          {/* Reset */}
          <button
            onClick={handleResetClick}
            className="text-xs font-bold text-gray-400 hover:text-orange-600 px-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bill Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataList.length > 0 ? (
                dataList.map((booking, index) => (
                  <tr
                    key={booking._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.userId?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.userId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.date
                          ? new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-600 font-medium">
                          {booking.timeSlotId?.timeSlot || "N/A"}
                        </div>
                        {booking.timeSlotId?.discountPercent > 0 && (
                          <div className="text-xs text-blue-600">
                            {booking.timeSlotId.discountPercent}% discount
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        <Users size={12} className="mr-1" />
                        {booking.numberOfGuests} Guests
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status === "Cancelled" ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700`}
                        >
                          Cancelled
                        </span>
                      ) : booking.status === "Completed" ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700`}
                        >
                          Completed
                        </span>
                      ) : (
                        <select
                          className="text-xs font-medium bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded outline-none hover:border-gray-400 appearance-none cursor-pointer"
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(booking._id, e.target.value)
                          }
                        >
                          {[
                            "Pending",
                            "Confirmed",
                            "Accepted",
                            "Cancelled",
                            "Completed"
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${isBillGenerated(booking)
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {isBillGenerated(booking) ? "Generated" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {booking?.status === "Completed" && (
                          <button
                            onClick={() =>
                              !isBillGenerated(booking) &&
                              handleGenerateBill(booking)
                            }
                            disabled={isBillGenerated(booking)}
                            className={getGenerateBillButtonStyle(booking)}
                            title={
                              isBillGenerated(booking)
                                ? "Bill already generated"
                                : "Generate Bill"
                            }
                          >
                            <FileText size={14} className="mr-1" />
                            {getGenerateBillButtonText(booking)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          No Bookings Found
                        </p>
                        <p className="text-gray-500">
                          Bookings will appear here once customers make
                          reservations.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="border px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          disabled={currentpage === 1}
          onClick={goToPrevpage}
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
          onClick={goToNextPage}
        >
          Next
        </button>
      </div>

      {/* Bill Generation Modal */}
      {showBillGeneration && selectedBooking && (
        <BillGeneration
          isOpen={showBillGeneration}
          onClose={() => {
            setShowBillGeneration(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          restaurantId={
            selectedBooking?.restaurantId?._id || selectedBooking?.restaurantId
          }
          userId={selectedBooking?.userId?._id || selectedBooking?.userId}
          onBillCreated={handleBillCreated}
          showToast={handleToastMessage}
        />
      )}
    </>
  );
}

export default HanldeBooking;
