import React, { useState, useEffect } from "react";

import { EyeIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import { billService } from "../../services/billService";
import Loader from "../common/Loader";
import BillDetails from "./BillDetails";

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
        // Update the bill in the list

        setBills(
          bills.map((bill) =>
            bill._id === billId ? { ...bill, paymentStatus: newStatus } : bill
          )
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  };

  const paymentStatusStyles = {
    Unpaid: "bg-red-100 text-red-700 border border-red-300",
    Paid: "bg-green-100 text-green-700 border border-green-300",
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
      <div className="w-full bg-white text-black shadow-md rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="w-full text-center">
            <h2 className="text-xl font-semibold">Bills List</h2>
          </div>
        </div>

        {loading ? (
          <Loader loading={loading} size={60} />
        ) : bills.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-base font-extrabold">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Booking Date</th>
                    <th className="p-3">Guests</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {bills.map((bill) => (
                    <tr key={bill._id} className="border-b">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">
                            {bill?.userId?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bill?.userId?.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {bill?.bookingId?.date
                          ? new Date(bill.bookingId.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {bill?.bookingId?.numberOfGuests || "N/A"}
                      </td>
                      <td className="p-3">{bill.items?.length || 0} items</td>

                      <td className="p-3 font-semibold">
                        ₹{bill.grandTotal?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`w-fit px-3 py-1 text-center rounded-full text-xs font-medium ${paymentStatusStyles[bill?.paymentStatus] ||
                            "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {bill?.paymentStatus || "Unpaid"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewBill(bill)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="View Bill Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {bill?.paymentStatus === "Unpaid" && (
                            <button
                              onClick={() =>
                                handleUpdatePaymentStatus(bill._id, "Paid")
                              }
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Mark as Paid"
                            >
                              <CurrencyRupeeIcon className="h-5 w-5" />
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
            <div className="flex justify-between items-center mt-4">
              <button
                className="border px-4 py-2 rounded-lg text-sm"
                disabled={currentPage === 1}
                onClick={goToPrevPage}
              >
                Previous
              </button>
              <div className="flex gap-2">
                <span>
                  page {currentPage} of {totalPages}
                </span>
              </div>
              <button
                className="border px-4 py-2 rounded-lg text-sm"
                disabled={currentPage === totalPages}
                onClick={goToNextPage}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="h-full flex text-gray-800 items-center justify-center">
            <p className="text-3xl font-bold">No Bills Generated Yet</p>
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
