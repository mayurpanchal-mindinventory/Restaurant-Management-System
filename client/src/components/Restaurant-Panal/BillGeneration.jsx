import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { billService } from "../../services/billService";

const BillGeneration = ({
  isOpen,
  onClose,
  booking,
  restaurantId,
  userId,
  onBillCreated,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && restaurantId) {
      fetchMenuItems();
    }
  }, [isOpen, restaurantId]);

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
        discountPercent,
        isSharedWithUser: false,
        paymentStatus: "Unpaid",
      };
      console.log(billData);
      const response = await billService.createBill(billData);

      if (response.success) {
        onBillCreated(response.data);
        onClose();
        // Reset form
        setSelectedItems([]);
        setDiscountPercent(0);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Generate Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Customer:</span>{" "}
                {booking?.userId?.name}
              </div>
              <div>
                <span className="font-medium">Date:</span>{" "}
                {new Date(booking?.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Guests:</span>{" "}
                {booking?.numberOfGuests}
              </div>
              <div>
                <span className="font-medium">Status:</span> {booking?.status}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Select Menu Items</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {menuItems?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item?.name}</div>

                      <div className="text-sm text-gray-600">₹{item?.price}</div>
                    </div>
                    <button
                      onClick={() => addItemToBill(item)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Bill Summary</h3>

              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>

                      <div className="text-sm text-gray-600">
                        ₹{item.price} each
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateItemQuantity(item.itemId, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateItemQuantity(item.itemId, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        +
                      </button>

                      <div className="w-16 text-right font-medium">
                        ₹{item.total.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Discount (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(Number(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1 text-right"
                    />
                  </div>

                  <div className="flex justify-between">
                    <span>Discount Amount:</span>
                    <span>-₹{calculateDiscountAmount().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{calculateGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBill}
                  disabled={loading || selectedItems.length === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Bill"}
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
