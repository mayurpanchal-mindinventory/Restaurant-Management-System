import React, { useState, useEffect } from "react";

import { EyeIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import { billService } from "../../services/billService";
import Loader from "../common/Loader";
import BillDetails from "./BillDetails";
import {
  FileText,
  Calendar,
  Users,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  CreditCard,
  Search,
  Filter,
  Check,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";

const BillList = ({ userId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);

  // Statistics states
  const [totalrecord, setTotalrecord] = useState(0);
  const [countStatus, setCountStatus] = useState({
    totalPaid: 0,
    totalUnpaid: 0,
    totalRevenue: 0,
  });

  // Single filter state (like HandleBooking)
  const [tempFilters, setTempFilters] = useState({
    search: "",
    date: "",
    paymentStatus: "",
    sortByDate: "newest",
  });

  const fetchBills = async (page = 1, filtersToUse = tempFilters) => {
    setLoading(true);
    try {
      console.log("hhhhhhhhh", page);
      const response = await billService.getBills(userId, page, filtersToUse);

      if (response) {
        setBills(response.bills || []);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || page);
        setTotalrecord(response.totalDocs || 0);

        // Set statistics from backend response
        setCountStatus({
          totalPaid: response.totalPaid || 0,
          totalUnpaid: response.totalUnpaid || 0,
          totalRevenue: response.totalRevenue || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBills(currentPage);
    }
  }, [userId, currentPage]);

  // Handle filter input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters immediately (like HandleBooking)
  const handleApplyClick = () => {
    setCurrentPage(1);
    fetchBills(1);
  };

  // Reset filters (like HandleBooking)
  const handleResetClick = () => {
    const emptyFilters = {
      search: "",
      date: "",
      paymentStatus: "",
      sortByDate: "newest",
    };
    setTempFilters(emptyFilters);
    setCurrentPage(1);
    fetchBills(1, emptyFilters);
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillDetails(true);
  };

  const handleUpdatePaymentStatus = async (billId, newStatus) => {
    try {
      const response = await billService.updatePaymentStatus(billId, newStatus);
      if (response) {
        // Show success toast when payment is marked as Paid
        if (newStatus === "Paid") {
          toast.success("Payment successful!");
        }
        // Update the bill in the list
        setBills(
          bills.map((bill) =>
            bill._id === billId ? { ...bill, paymentStatus: newStatus } : bill
          )
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const handleToggleSharedWithUser = async (billId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      if (newStatus == true) {
        toast.success("Bill shared to customer successfully");
      }

      const response = await billService.updateSharedWithUser(
        billId,
        newStatus
      );
      if (response) {
        // Update the bill in the list
        setBills(
          bills.map((bill) =>
            bill._id === billId
              ? { ...bill, isSharedWithUser: newStatus }
              : bill
          )
        );
      }
    } catch (error) {
      console.error("Error updating shared with user status:", error);
      alert("Failed to update shared with user status");
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {/* State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{totalrecord}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {countStatus.totalPaid}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {countStatus.totalUnpaid}
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
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{countStatus.totalRevenue?.toFixed(0) || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex items-center gap-3">
          <div className="flex-grow relative lg:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="search"
              type="text"
              placeholder="Search customer name or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 outline-none"
              value={tempFilters.search}
              onChange={handleChange}
            />
          </div>

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

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              name="paymentStatus"
              className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:border-orange-500 outline-none"
              value={tempFilters.paymentStatus}
              onChange={handleChange}
            >
              <option value="">All Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              name="sortByDate"
              className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:border-orange-500 outline-none"
              value={tempFilters.sortByDate}
              onChange={handleChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <button
            onClick={handleApplyClick}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 transition-all shadow-sm active:scale-95"
          >
            <Check size={16} />
            Apply Filters
          </button>

          <button
            onClick={handleResetClick}
            className="text-xs font-bold text-gray-400 hover:text-orange-600 px-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Bills</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader loading={loading} size={60} />
              <p className="text-gray-600 font-medium">Loading bills...</p>
            </div>
          </div>
        ) : bills.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className=" hidden md:table min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Shared
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bills.map((bill, index) => (
                    <tr
                      key={bill._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bill?.userId?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bill?.userId?.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bill?.bookingId?.date
                            ? new Date(bill.bookingId.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          <Users size={12} className="mr-1" />
                          {bill?.bookingId?.numberOfGuests || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          <ShoppingBag size={12} className="mr-1" />
                          {bill.items?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{bill.grandTotal?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                            bill?.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {bill?.paymentStatus || "Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bill?.paymentStatus === "Paid" ? (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bill?.isSharedWithUser || false}
                              onChange={() =>
                                handleToggleSharedWithUser(
                                  bill._id,
                                  bill?.isSharedWithUser || false
                                )
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </label>
                        ) : (
                          <input
                            type="checkbox"
                            disabled
                            className="h-4 w-4 text-gray-400 focus:ring-gray-400 border-gray-300 rounded cursor-not-allowed"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewBill(bill)}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-dark text-xs font-medium hover:bg-orange-100 hover:text-orange-600 rounded "
                            title="View Bill Details"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                          {bill?.paymentStatus === "Unpaid" && (
                            <button
                              onClick={() =>
                                handleUpdatePaymentStatus(bill._id, "Paid")
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                              title="Mark as Paid"
                            >
                              <CreditCard size={14} className="mr-1" />
                              Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden">
                {bills.length > 0 ? (
                  <div className="space-y-4">
                    {bills.map((bill, index) => (
                      <div
                        key={bill._id || index}
                        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                #{String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {bill?.userId?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {bill?.userId?.email || "No-email"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {bill?.bookingId?.date
                                ? new Date(
                                    bill?.bookingId?.date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">Guest</p>
                            <p className=" flex flex-row items-baseline  text-sm font-medium text-gray-900">
                              <Users size={13} className="mr-1" />
                              {bill?.bookingId?.numberOfGuests || "N/A"}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">Items</p>
                            <p className=" flex flex-row items-baseline  text-sm font-medium text-gray-900">
                              <ShoppingBag size={12} className="mr-1" />
                              {bill.items?.length || 0} items
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className=" flex flex-row items-baseline  text-sm font-medium text-gray-900">
                              ₹{bill.grandTotal?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Payment status
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                                bill?.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {bill?.paymentStatus || "Unpaid"}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              share with user
                            </p>
                            {bill?.paymentStatus === "Paid" ? (
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={bill?.isSharedWithUser || false}
                                  onChange={() =>
                                    handleToggleSharedWithUser(
                                      bill._id,
                                      bill?.isSharedWithUser || false
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </label>
                            ) : (
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4 text-gray-400 focus:ring-gray-400 border-gray-300 rounded cursor-not-allowed"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewBill(bill)}
                                className="inline-flex items-around px-3 py-1.5 bg-gray-100 text-dark text-xs font-medium hover:bg-orange-100 hover:text-orange-600 rounded "
                                title="View Bill Details"
                              >
                                <Eye size={14} className="mr-1" />
                                View
                              </button>
                              {bill?.paymentStatus === "Unpaid" && (
                                <button
                                  onClick={() =>
                                    handleUpdatePaymentStatus(bill._id, "Paid")
                                  }
                                  className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                                  title="Mark as Paid"
                                >
                                  <CreditCard size={14} className="mr-1" />
                                  Payment
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar size={24} className="text-gray-400" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-gray-900">
                      No Bill Found
                    </p>
                    <p className="text-gray-500 text-center mt-1">
                      Bill will appear here once you created from booking
                      section.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Pagination */}
            <div className="px-6 py-2 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={goToPrevPage}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={goToNextPage}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  No Bills Generated Yet
                </p>
                <p className="text-sm text-gray-500">
                  Bills will appear here once you generate them for completed
                  bookings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Bill Details Modal */}
      {showBillDetails && selectedBill && (
        <BillDetails
          bill={selectedBill}
          onClose={() => {
            setShowBillDetails(false);
            setSelectedBill(null);
          }}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
        />
      )}
    </>
  );
};

export default BillList;
