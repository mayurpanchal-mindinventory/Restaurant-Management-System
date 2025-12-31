import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  History,
  ReceiptText,
  LayoutDashboard,
  Loader2,
  Eye,
  Calendar,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { getBookings, getBillByUser } from "../services/userService";
import bookingImg from "../assets/booking.jpg";
import BillDetails from "../components/Restaurant-Panal/BillDetails";

function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billsLoading, setBillsLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    searchDate: "",
    searchRestaurant: "",
    sortOrder: "desc", // 'desc' means newest first and accordiglyy
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    bookingsPage: 1,
    billsPage: 1,
    bookingsTotalPages: 1,
    billsTotalPages: 1,
    bookingsTotal: 0,
    billsTotal: 0,
  });

  // Fetch bookings with filters and pagination
  const fetchBookings = useCallback(async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }
      const userData = JSON.parse(userString);
      const userId = userData?.user?.id || userData?.id;

      if (userId) {
        const options = {
          page: pagination.bookingsPage,
          limit: 10,
          searchDate: filters.searchDate,
          searchRestaurant: filters.searchRestaurant,
          sortBy: "date",
          sortOrder: filters.sortOrder,
          status:
            activeTab === "overview"
              ? "current"
              : activeTab === "history"
              ? "past"
              : undefined,
        };

        const result = await getBookings(userId, options);
        const responseData = result?.data?.data || result?.data;

        if (responseData) {
          setBookings(responseData.bookings || responseData || []);
          if (responseData.pagination) {
            setPagination((prev) => ({
              ...prev,
              bookingsTotalPages: responseData.pagination.totalPages || 1,
              bookingsTotal: responseData.pagination.total || 0,
            }));
          }
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.bookingsPage, filters, activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Fetch bills with filters and pagination
  const fetchBills = useCallback(async () => {
    try {
      setBillsLoading(true);
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user found in localStorage");
        setBillsLoading(false);
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData?.user?.id || userData?.id;

      if (userId) {
        const options = {
          page: pagination.billsPage,
          limit: 10,
          searchDate: filters.searchDate,
          searchRestaurant: filters.searchRestaurant,
          sortBy: "createdAt",
          sortOrder: filters.sortOrder,
        };

        const response = await getBillByUser(userId, options);
        const responseData = response?.data?.data || response?.data;

        if (responseData) {
          setBills(responseData.bills || responseData || []);
          if (responseData.pagination) {
            setPagination((prev) => ({
              ...prev,
              billsTotalPages: responseData.pagination.totalPages || 1,
              billsTotal: responseData.pagination.total || 0,
            }));
          }
        } else {
          setBills([]);
        }
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setBillsLoading(false);
    }
  }, [pagination.billsPage, filters]);

  useEffect(() => {
    if (activeTab === "bill") {
      fetchBills();
    }
  }, [fetchBills, activeTab]);

  // Filter and sort bills on client side for additional filtering
  const filteredBills = useMemo(() => {
    let result = [...bills];

    // Filter by restaurant name (client-side additional filter)
    if (filters.searchRestaurant) {
      const searchLower = filters.searchRestaurant.toLowerCase();
      result = result.filter((bill) =>
        bill.restaurantId?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Sort bills by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.bookingId?.date || 0);
      const dateB = new Date(b.createdAt || b.bookingId?.date || 0);
      return filters.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [bills, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      bookingsPage: 1,
      billsPage: 1,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchDate: "",
      searchRestaurant: "",
      sortOrder: "desc",
    });
    setPagination((prev) => ({
      ...prev,
      bookingsPage: 1,
      billsPage: 1,
    }));
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  // Pagination handlers
  const goToBookingsPage = (page) => {
    if (page >= 1 && page <= pagination.bookingsTotalPages) {
      setPagination((prev) => ({ ...prev, bookingsPage: page }));
    }
  };

  const goToBillsPage = (page) => {
    if (page >= 1 && page <= pagination.billsTotalPages) {
      setPagination((prev) => ({ ...prev, billsPage: page }));
    }
  };

  const bookingHeaders = [
    "#",
    "Restaurant Name",
    "Guests",
    "Date",
    "Time Slot",
    "Status",
  ];

  const billHeaders = [
    "#",
    "Restaurant Name",
    "Guests",
    "Date",
    "Time Slot",
    "Total Amount",
    "Actions",
  ];

  const getCurrentHeaders = () => {
    return activeTab === "bill" ? billHeaders : bookingHeaders;
  };

  const tabs = [
    { id: "overview", label: "Current Bookings", icon: LayoutDashboard },
    { id: "history", label: "Past Booking History", icon: History },
    { id: "bill", label: "Get Your Bill", icon: ReceiptText },
  ];

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillDetails(true);
  };

  const renderBookingRows = (dataList) => {
    if (dataList.length === 0) {
      return (
        <tr>
          <td
            colSpan={bookingHeaders.length}
            className="px-6 py-10 text-center text-gray-500"
          >
            No bookings found for this category.
          </td>
        </tr>
      );
    }
    return dataList.map((customer, index) => (
      <tr
        key={customer._id || index}
        className={
          index % 2 === 0
            ? "bg-white"
            : "bg-gray-50 hover:bg-orange-50 transition-colors"
        }
      >
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
          {(pagination.bookingsPage - 1) * 10 + index + 1}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
          {customer.restaurantId?.name || "N/A"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
          {customer.numberOfGuests} Guests
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
          {customer.date
            ? new Date(customer.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
          {customer?.timeSlotId?.timeSlot || "N/A"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              customer.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {customer.status}
          </span>
        </td>
      </tr>
    ));
  };

  const renderBillRows = () => {
    if (billsLoading) {
      return (
        <tr>
          <td colSpan={billHeaders?.length} className="px-6 py-10 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-gray-500 font-medium">Loading your bills...</p>
            </div>
          </td>
        </tr>
      );
    }

    if (filteredBills.length === 0) {
      return (
        <tr>
          <td
            colSpan={billHeaders?.length}
            className="px-6 py-10 text-center text-gray-500"
          >
            No bills found. Bills will appear here once your restaurant bookings
            are completed.
          </td>
        </tr>
      );
    }

    return filteredBills?.map((bill, index) => (
      <tr
        key={bill?._id || index}
        className={
          index % 2 === 0
            ? "bg-white"
            : "bg-gray-50 hover:bg-orange-50 transition-colors"
        }
      >
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
          {(pagination.billsPage - 1) * 10 + index + 1}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
          {bill?.restaurantId?.name || "Restaurant"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
          {bill?.bookingId?.numberOfGuests || "N/A"} Guests
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
          {bill?.bookingId?.date
            ? new Date(bill?.bookingId?.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
          {bill.bookingId?.timeSlotId?.timeSlot || "N/A"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
          ₹{bill.grandTotal?.toFixed(2) || "0.00"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm">
          <button
            onClick={() => handleViewBill(bill)}
            className="flex items-center space-x-2 px-3 py-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">View Bill</span>
          </button>
        </td>
      </tr>
    ));
  };

  // Render filter and sort controls
  const renderFilters = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search by Date */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            name="searchDate"
            value={filters.searchDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Select date"
          />
        </div>

        {/* Search by Restaurant */}
        <div className="flex items-center space-x-2 flex-grow max-w-xs">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            name="searchRestaurant"
            value={filters.searchRestaurant}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            placeholder="Search restaurant..."
          />
        </div>

        {/* Sort Toggle */}
        <button
          onClick={toggleSortOrder}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors 
               bg-orange-100 text-orange-700 hover:bg-orange-200`}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>
            {filters.sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </span>
        </button>

        {/* Clear Filters */}

        <button
          onClick={clearFilters}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          <span>Clear</span>
        </button>
      </div>
    </div>
  );

  // Render pagination
  const renderPagination = (type) => {
    const currentPage =
      type === "bookings" ? pagination.bookingsPage : pagination.billsPage;
    const totalPages =
      type === "bookings"
        ? pagination.bookingsTotalPages
        : pagination.billsTotalPages;
    const total =
      type === "bookings" ? pagination.bookingsTotal : pagination.billsTotal;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span> (
          <span className="font-medium">{total}</span> total)
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              type === "bookings"
                ? goToBookingsPage(currentPage - 1)
                : goToBillsPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() =>
                  type === "bookings"
                    ? goToBookingsPage(pageNum)
                    : goToBillsPage(pageNum)
                }
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? "bg-orange-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              type === "bookings"
                ? goToBookingsPage(currentPage + 1)
                : goToBillsPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div
        className="relative h-64 w-full overflow-hidden bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bookingImg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute z-20 top-20 left-6 bg-white hover:bg-orange-500 hover:text-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 "
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-8  top-20 w-full flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl font-bold text-white">
            My <span className="text-orange-500">Bookings</span>
          </h1>
          <p className="text-gray-200 mt-2 text-sm uppercase tracking-widest text-center">
            Manage your dining reservations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-xl mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-8 py-5 font-semibold transition-all duration-300 whitespace-nowrap border-b-2 ${
                    isActive
                      ? "text-orange-600 border-orange-600 bg-orange-50/50"
                      : "text-gray-500 border-transparent hover:text-orange-500 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-2 md:p-6 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-gray-500 font-medium">
                Fetching your reservations...
              </p>
            </div>
          ) : (
            <>
              {/* Filters Section */}
              {renderFilters()}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {getCurrentHeaders().map((header) => (
                        <th
                          key={header}
                          className="px-4 py-4 text-left text-xs font-bold text-orange-600 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            {header}
                            <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {activeTab === "overview" && renderBookingRows(bookings)}
                    {activeTab === "history" && renderBookingRows(bookings)}
                    {activeTab === "bill" && renderBillRows()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(activeTab === "overview" || activeTab === "history") &&
                renderPagination("bookings")}
              {activeTab === "bill" && renderPagination("bills")}
            </>
          )}
        </div>
      </div>

      {showBillDetails && selectedBill && (
        <BillDetails
          bill={selectedBill}
          onClose={() => {
            setShowBillDetails(false);
            setSelectedBill(null);
          }}
          onUpdatePaymentStatus={() => {}}
        />
      )}
    </div>
  );
}

export default MyBookings;
