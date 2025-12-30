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
} from "lucide-react";
import toast from "react-hot-toast";

const BillList = ({ userId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);

  const fetchBills = async (page = 1) => {
    setLoading(true);
    try {
      const response = await billService.getBills(userId, page);
      console.log(response);

      if (response.data.bills) {
        setBills(response.data.bills);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBills(currentPage);
    }
  }, [userId, currentPage]);

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

  // Calculate statistics
  const totalBills = bills.length;
  const paidBills = bills.filter(
    (bill) => bill.paymentStatus === "Paid"
  ).length;
  const unpaidBills = bills.filter(
    (bill) => bill.paymentStatus === "Unpaid"
  ).length;
  const totalRevenue = bills
    .filter((bill) => bill.paymentStatus === "Paid")
    .reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);

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
              <p className="text-2xl font-bold text-gray-900">{totalBills}</p>
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
              <p className="text-2xl font-bold text-gray-900">{paidBills}</p>
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
              <p className="text-2xl font-bold text-gray-900">{unpaidBills}</p>
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
                ₹{totalRevenue.toFixed(0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
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
              <table className="min-w-full">
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
                  {bills.map((bill) => (
                    <tr
                      key={bill._id}
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
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
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
