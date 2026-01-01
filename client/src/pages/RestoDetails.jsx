import { useEffect, useState } from "react";
import {
  getRestaurantsById,
  getSlotListByRestaurant,
} from "../services/adminService";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Users,
  Calendar as CalendarIcon,
  Utensils,
  Camera,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "react-hot-toast";
import MenuDetails from "../components/MenuDetails";
import { useSelector } from "react-redux";
import { createBookings } from "../services/userService";

function RestoDetails() {
  //for slot manage with date
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsForDate, setSlotsForDate] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const disCount = location.state?.discount;
  // console.log(location.state?.discount);
  const [timeSlots, setTimeSlots] = useState([]);
  const [resto, setResto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingLoading, setBookingLoading] = useState(false);
  const userString = localStorage.getItem("user");
  const userData = JSON.parse(userString);
  const userId = userData.user.id;

  const [bookingData, setBookingData] = useState({
    userId: userId,
    restaurantId: id,
    timeSlotId: "",
    numberOfGuests: 2,
    date: "",
  });
  // Calculate remaining seats based on selected slot and current guest count
  const getRemainingSeats = () => {
    if (!selectedSlot) return 0;
    return selectedSlot.maxBookings - bookingData.numberOfGuests;
  };

  const validateBookingData = () => {
    if (!bookingData.date) {
      toast.error("Please select a booking date");
      return false;
    }
    if (!bookingData.timeSlotId) {
      toast.error("Please select a time slot");
      return false;
    }
    if (bookingData.numberOfGuests < 1 || bookingData.numberOfGuests > 20) {
      toast.error("Number of guests must be between 1 and 20");
      return false;
    }
    const remainingSeats = getRemainingSeats();
    if (remainingSeats < 0) {
      toast.error(
        `Only ${selectedSlot.maxBookings} seats available for this slot`
      );
      return false;
    }
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("Booking date cannot be in the past");
      return false;
    }
    return true;
  };

  useEffect(() => {
    console.log(timeSlots);
    if (!selectedDate) {
      setSlotsForDate([]);
      setSelectedSlot(null);
      return;
    }

    const slots = timeSlots.filter(
      (slot) => new Date(slot?.date).toISOString().split("T")[0] == selectedDate
    );
    setSlotsForDate(slots);
    setSelectedSlot(null);
  }, [selectedDate, timeSlots]);

  const handleBooking = async () => {
    if (!validateBookingData()) {
      return;
    }

    try {
      setBookingLoading(true);
      const result = await createBookings(bookingData);

      if (result.data) {
        toast.success("Restaurant booked successfully!", {
          duration: 5000,
          icon: "🎉",
        });
        setBookingData({
          userId: userId,
          restaurantId: id,
          timeSlotId: "",
          numberOfGuests: 2,
          date: "",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to book restaurant. Please try again.";

      toast.error(errorMessage, {
        duration: 5000,
        icon: "❌",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchResto = async (id) => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Restaurant ID not found");
          setLoading(false);
          return;
        }

        const response = await getRestaurantsById(id);
        setResto(response.data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchResto(id);
  }, [id, timeSlots]);

  const getSlotHour = (timeStr) => {
    const [time, modifier] = timeStr.split(" - ")[0].split(" ");
    let [hours] = time.split(":");
    let hour = parseInt(hours, 10);
    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;
    return hour;
  };

  const now = new Date();
  const todayDateStr = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  const filteredSlots = slotsForDate?.filter((time) => {

    const selectedDateStr = bookingData?.date;
    if (selectedDateStr < todayDateStr) return false;

    if (selectedDateStr === todayDateStr) {
      return getSlotHour(time.timeSlot) > currentHour;
    }
    return true;
  });

  useEffect(() => {
    const fetchSlots = async () => {
      const response = await getSlotListByRestaurant(id, "", "", "");

      console.log("hhhh", response.data.data.data.slots);

      setTimeSlots(response.data.data.data.slots);
      // console.log("heloooooooooooooo", response.data.data);
    };
    fetchSlots();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatClosedDates = (dates) => {
    if (!dates || dates.length === 0) return "No upcoming closures";
    return dates.map((date) => formatDate(date)).join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Restaurant
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!resto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Restaurant Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The restaurant you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }


  const tabs = [
    { id: "overview", label: "Restaurant Details ", icon: LayoutDashboard },
    { id: "menu", label: "Menu Items", icon: Utensils },
    { id: "photos", label: "Photos", icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={resto.mainImage || "Image here"}
          alt={resto.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "Image here";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition duration-200 z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Restaurant Name and Logo */}
        <div className="absolute bottom-6 left-6 flex items-center space-x-4">
          {resto.logoImage && (
            <img
              src={resto.logoImage}
              alt={`${resto.name} logo`}
              className="w-16 h-16 rounded-xl object-cover shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/64x64?text=Logo";
              }}
            />
          )}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
              {resto.name}
            </h1>
            <p className="text-white text-opacity-90">
              {resto.description?.substring(0, 80)}...
            </p>
          </div>
        </div>

        {/* Rating - Bottom Right */}
        <div className="absolute bottom-6 right-6 bg-transparent bg-opacity-95 px-6 py-3 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <div>
              <div className="absolute top-0 right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
                <span className="text-orange-500 font-bold text-xl">
                  {disCount}%
                </span>
                <span className="text-gray-600 text-sm font-medium">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[70%]">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition duration-200 whitespace-nowrap ${activeTab === tab.id
                        ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                        : "text-gray-600 hover:text-orange-500 hover:bg-gray-50"
                        }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      About <span className="underline">{resto.name}</span>{" "}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {resto.description ||
                        "Restaurant description not available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-orange-500" />
                        <h4 className="text-xl font-semibold text-gray-800">
                          Operating Days
                        </h4>
                      </div>
                      {resto.openDays && resto.openDays.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {resto.openDays.map((day, index) => (
                            <span
                              key={index}
                              className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Operating days not specified
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Calendar className="w-6 h-6 text-orange-500" />
                        <h4 className="text-xl font-semibold text-gray-800">
                          Upcoming Closures
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        {formatClosedDates(
                          resto.closedDates.filter((date) => {
                            const closedDate = new Date(date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            return closedDate >= today;
                          })
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resto.userId?.email && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail className="w-5 h-5 text-orange-500" />
                        <span>{resto.userId.email}</span>
                      </div>
                    )}
                    {resto.userId?.phone && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Phone className="w-5 h-5 text-orange-500" />
                        <span>{resto.userId.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/*Menu part */}
              {activeTab === "menu" && (
                <div className="text-center py-12">
                  <h3 className="text-xl flex flex-row font-semibold text-gray-600 mb-2">
                    Menu Items
                  </h3>
                  <div className="text-gray-500">
                    <MenuDetails id={resto._id} />
                  </div>
                </div>
              )}

              {activeTab === "photos" && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Restaurant Photos
                  </h3>
                  <p className="text-gray-500">
                    <img src={resto.mainImage} />
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-[30%]">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Book Restaurant
              </h3>
              {/* Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Booking
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => {
                      setBookingData({ ...bookingData, date: e.target.value }),
                        setSelectedDate(e.target.value);
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              {/* Time Slots */}
              {selectedDate && slotsForDate.length > 0 ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredSlots?.map((time) => (
                      <button
                        disabled={time?.maxBookings < 1}
                        key={time.timeSlot}
                        onClick={() => {
                          setBookingData({ ...bookingData, timeSlotId: time._id });
                          setSelectedSlot(slotsForDate.find((s) => s._id === time._id) || null);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition duration-200 ${bookingData.timeSlotId === time._id
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                          }`}
                      >
                        {time.timeSlot}
                      </button>
                    ))}
                    {filteredSlots?.length === 0 && <p className="col-span-2 text-gray-400">No slots available for this date.</p>}
                  </div>
                </div>
              ) : selectedDate != "" ? (
                <div className="text-center text-red-600">
                  No slot available
                </div>
              ) : (
                <div />
              )}
              {/* Number of People */}
              {selectedSlot && selectedSlot?.maxBookings > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          numberOfGuests: Math.max(
                            1,
                            bookingData.numberOfGuests - 1
                          ),
                        })
                      }
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition duration-200"
                    >
                      -
                    </button>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-lg font-semibold">
                        {bookingData.numberOfGuests}
                      </span>
                    </div>
                    <button
                      disabled={
                        bookingData.numberOfGuests >= 20 ||
                        bookingData.numberOfGuests + 1 >
                        selectedSlot?.maxBookings
                      }
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          numberOfGuests: bookingData.numberOfGuests + 1,
                        })
                      }
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition duration-200 ${bookingData.numberOfGuests >= 20 ||
                        bookingData.numberOfGuests + 1 >
                        selectedSlot?.maxBookings
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }`}
                    >
                      +
                    </button>
                    {selectedSlot ? (
                      <p
                        className={
                          getRemainingSeats() <= 5
                            ? "text-red-600 font-semibold"
                            : getRemainingSeats() <= 10
                              ? "text-orange-600 font-medium"
                              : "text-green-600"
                        }
                      >
                        {getRemainingSeats() > 0
                          ? `${getRemainingSeats()} seat${getRemainingSeats() !== 1 ? "s" : ""
                          } remaining`
                          : "No seats available"}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
              )}

              <button
                disabled={
                  bookingLoading || !bookingData.date || !bookingData.timeSlotId
                }
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center space-x-2"
                onClick={handleBooking}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Book Restaurant</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestoDetails;
