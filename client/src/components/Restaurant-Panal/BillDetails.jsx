import React, { useState } from "react";

import {
  XMarkIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const BillDetails = ({ bill, onClose, onUpdatePaymentStatus }) => {
  if (!bill) return null;
  // const [show, setShow] = useState(true);
  {
    console.log(bill);
  }
  const paymentStatusStyles = {
    Unpaid: "bg-red-100 text-red-700 border border-red-300",
    Paid: "bg-green-100 text-green-700 border border-green-300",
  };

  const handleUpdatePaymentStatus = () => {
    const newStatus = bill.paymentStatus === "Paid" ? "Unpaid" : "Paid";
    onUpdatePaymentStatus(bill._id, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Bill Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Restaurant Information</h3>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {bill?.restaurantId?.name}
                </div>
                <div className="flex flex-row gap-7 ">
                  <span className="font-medium">Logo:</span>{" "}
                  {bill?.restaurantId?.logoImage ? (
                    <img
                      className="h-[50px] w-[50px] rounded-full"
                      src={bill?.restaurantId?.logoImage}
                    />
                  ) : (
                    "Not Available"
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {bill?.userId?.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {bill?.userId?.email}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Booking Information</h3>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {bill?.bookingId?.date
                    ? new Date(bill.bookingId.date).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Guests:</span>{" "}
                  {bill?.bookingId?.numberOfGuests || "N/A"}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Bill Information</h3>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Bill ID:</span> {bill._id}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(bill.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(bill.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center p-4 border rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-gray-600 mr-3" />
              <div>
                <div className="font-medium">Payment Status</div>
                <span
                  className={`w-fit px-3 py-1 text-center rounded-full text-xs font-medium ${
                    paymentStatusStyles[bill?.paymentStatus] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {bill?.paymentStatus || "Unpaid"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Bill Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Price</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {bill.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">
                            {typeof item.name === "string"
                              ? item.name
                              : item.name?.name || "Unknown Item"}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        ₹
                        {typeof item.price === "number"
                          ? item.price.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="p-3 text-center">{item.quantity || 1}</td>

                      <td className="p-3 text-right font-medium">
                        ₹
                        {typeof item.total === "number"
                          ? item.total.toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="max-w-sm ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{bill.subtotal?.toFixed(2) || "0.00"}</span>
                </div>

                {bill.discountPercent > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Discount ({bill.discountPercent}%):</span>
                      <span>-₹{bill.discountAmount?.toFixed(2) || "0.00"}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Grand Total:</span>
                  <span>₹{bill.grandTotal?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* {bill.isSharedWithUser && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> This bill has been shared with the
                customer.
              </div>
            </div>
          )} */}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
