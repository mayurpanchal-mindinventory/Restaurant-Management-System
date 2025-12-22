import { ChevronDown } from "lucide-react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  getBookingsByRestaurantId,
  updateBookingStatus,
} from "../../services/restaurantPanelService";
import { useSelector } from "react-redux";
import BillGeneration from "../../components/Restaurant-Panal/BillGeneration";

function HanldeBooking(params) {
  const fieldHeaders = [
    "#",
    "Customer Name",
    "Date of Reservation",
    "Time Slots",
    "Guests",
    "Current Status",
    "Change Status",
    "Actions",
  ];
  const [dataList, setdataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [ss, setss] = useState("");
  const [showBillGeneration, setShowBillGeneration] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setss(newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleGenerateBill = (booking) => {
    setSelectedBooking(booking);
    setShowBillGeneration(true);
  };

  const handleBillCreated = (newBill) => {
    console.log("Bill created:", newBill);
  };

  useEffect(() => {
    const fetchBookingById = async () => {
      try {
        setLoading(true);
        const result = await getBookingsByRestaurantId(user.id);
        console.log(result);
        // console.log(result);
        setdataList(result || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setdataList([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchBookingById();
    }
  }, [user?.id, ss]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {fieldHeaders.map((header) => (
                <th
                  key={header}
                  className="px-4 py-4 text-left text-xs font-bold text-orange-600 uppercase tracking-widest"
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
            {dataList.length > 0 ? (
              dataList.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className="hover:bg-orange-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {booking.userId?.name || "N/A"}
                    </div>
                    <div className="text-[13px] text-gray-500">
                      {booking.userId?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      {booking.timeSlotId?.timeSlot || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs  border border-blue-100">
                      {booking.numberOfGuests} Guests
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider   ${booking.status === "Completed"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : booking.status === "Accepted"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      disabled={booking.status == "Cancelled"}
                      className="text-[11px] font-bold bg-gray-50 border border-gray-200 text-gray-600 py-1 px-2 rounded-md outline-none hover:border-orange-400 appearance-none cursor-pointer"
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
                      }
                    >
                      <option value={booking.status}>{booking.status}</option>
                      {["Pending", "Accepted", "Cancelled", "Completed"]
                        .filter((s) => s !== booking.status)
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {booking?.status === "Completed" && (
                        <button
                          onClick={() => handleGenerateBill(booking)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Generate Bill"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-20 text-center text-gray-400 italic font-medium"
                >
                  No Bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
        />
      )}
    </>
  );
}
export default HanldeBooking;
