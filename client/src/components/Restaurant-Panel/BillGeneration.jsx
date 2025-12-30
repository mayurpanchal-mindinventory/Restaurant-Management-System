import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { billService } from "../../services/billService";
import {
  FileText,
  Calendar,
  Users,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Percent,
  DollarSign,
} from "lucide-react";

const BillGeneration = ({
  isOpen,
  onClose,
  booking,
  restaurantId,
  userId,
  onBillCreated,
  showToast, // Function to show toast notifications
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoDiscount, setAutoDiscount] = useState(0);

  useEffect(() => {
    if (isOpen && restaurantId) {
      fetchMenuItems();
      setAutoDiscountFromSlot();
    }
  }, [isOpen, restaurantId]);

  useEffect(() => {
    // Update discount when autoDiscount changes
    if (autoDiscount > 0) {
      setDiscountPercent(autoDiscount);
    }
  }, [autoDiscount]);

  const setAutoDiscountFromSlot = () => {
    if (booking?.timeSlotId?.discountPercent) {
      setAutoDiscount(booking.timeSlotId.discountPercent);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await billService.getMenuItems(restaurantId);
      setMenuItems(response.data.menuData || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError("Failed to load menu items");
    }
  };

  const addItemToBill = (menuItem) => {
    const existingItem = selectedItems.find(
      (item) => item.itemId === menuItem._id
    );
    if (existingItem) {
      updateItemQuantity(menuItem._id, existingItem.quantity + 1);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          itemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          total: menuItem.price,
        },
      ]);
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setSelectedItems(
      selectedItems.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            total: item.price * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.itemId !== itemId));
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscountAmount = () => {
    return (calculateSubtotal() * discountPercent) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount();
  };

  const handleCreateBill = async () => {
    if (selectedItems.length === 0) {
      setError("Please add at least one item to the bill");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const billData = {
        bookingId: booking._id,
        restaurantId,
        userId,
        items: selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
        discountPercent: discountPercent || autoDiscount, // Use provided discount or auto discount
        isSharedWithUser: false,
        paymentStatus: "Unpaid",
      };

      const response = await billService.createBill(billData);

      if (response.success) {
        // Show success toast
        showToast && showToast("Bill generated successfully!", "success");
        onBillCreated && onBillCreated(response.data);
        onClose();
        setSelectedItems([]);
        setDiscountPercent(0);
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to generate bill";
      setError(errorMessage);

      showToast && showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Generate Bill
              </h2>
              <p className="text-sm text-gray-600">
                Create a new bill for this booking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Booking Details */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-gray-600" />
              <h3 className="font-medium text-gray-900">Booking Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Customer
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {booking?.userId?.name}
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(booking?.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Guests</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking?.numberOfGuests}
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                    booking?.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking?.status}
                </span>
              </div>
            </div>

            {/* Auto Discount Display */}
            {autoDiscount > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Auto applied discount as per time slot is {autoDiscount}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Menu Items Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={20} className="text-gray-600" />
                <h3 className="font-medium text-gray-900">Select Menu Items</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {menuItems?.length > 0 ? (
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <div
                        key={item?._id}
                        className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item?.name}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            ₹{item?.price}
                          </div>
                        </div>
                        <button
                          onClick={() => addItemToBill(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={14} />
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      No menu items available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-gray-600" />
                <h3 className="font-medium text-gray-900">Bill Summary</h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {selectedItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ₹{item.price} each
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateItemQuantity(item.itemId, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(item.itemId, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <div className="w-20 text-right font-medium text-gray-900">
                            ₹{item.total.toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeItem(item.itemId)}
                            className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No items selected</p>
                  </div>
                )}
              </div>

              {/* Totals */}
              {selectedItems.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ₹{calculateSubtotal().toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Discount (%):
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {autoDiscount > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            (Auto: {autoDiscount}%)
                          </span>
                        )}
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={discountPercent}
                          onChange={(e) =>
                            setDiscountPercent(Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-right text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Discount Amount:
                      </span>
                      <span className="font-medium text-red-600">
                        -₹{calculateDiscountAmount().toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            Total:
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{calculateGrandTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBill}
                  disabled={loading || selectedItems.length === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Creating Bill..." : "Create Bill"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillGeneration;
