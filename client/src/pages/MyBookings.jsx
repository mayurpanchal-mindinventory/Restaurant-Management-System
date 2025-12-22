import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  History,
  ReceiptText,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { getBookings } from "../services/userService";
import bookingImg from "../assets/booking.jpg";

function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
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
          const result = await getBookings(userId);
          const data = result?.data?.data || result?.data || [];
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const currentBookings = useMemo(
    () => customers.filter((item) => item.status !== "Completed"),
    [customers]
  );

  const historyBookings = useMemo(
    () => customers.filter((item) => item.status === "Completed"),
    [customers]
  );

  const fieldHeaders = [
    "#",
    "Restaurant Name",
    "Guests",
    "Date",
    "Time Slot",
    "Status",
  ];

  const tabs = [
    { id: "overview", label: "Current Bookings", icon: LayoutDashboard },
    { id: "history", label: "Past Booking History", icon: History },
    { id: "bill", label: "Get Your Bill", icon: ReceiptText },
  ];

  const renderTableRows = (dataList) => {
    if (dataList.length === 0) {
      return (
        <tr>
          <td
            colSpan={fieldHeaders.length}
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
          {index + 1}
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
          {customer.timeSlotId?.timeSlot || "N/A"}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === "Completed"
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/*Header */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={bookingImg}
          alt="Bookings"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white hover:bg-orange-500 hover:text-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold text-white">
            My <span className="text-orange-500">Bookings</span>
          </h1>
          <p className="text-gray-200 mt-2 text-sm uppercase tracking-widest">
            Manage your dining reservations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-xl mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-8 py-5 font-semibold transition-all duration-300 whitespace-nowrap border-b-2 ${isActive
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

        {/* Content  */}
        <div className="bg-white rounded-2xl shadow-xl p-2 md:p-6 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-gray-500 font-medium">
                Fetching your reservations...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {activeTab === "overview" && renderTableRows(currentBookings)}
                  {activeTab === "history" && renderTableRows(historyBookings)}
                  {activeTab === "bill" && (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <ReceiptText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">
                          Billing system is currently being updated.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
