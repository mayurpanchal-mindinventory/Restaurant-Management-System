import { useEffect, useState } from "react";
import {
  getRestaurantsById,
  getSlotListByRestaurant,
} from "../services/adminService";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Users,
  Calendar as CalendarIcon,
  Utensils,
  Camera,
  MessageSquare,
} from "lucide-react";
import MenuDetails from "../components/MenuDetails";

function RestoDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const [timeSlots, setTimeSlots] = useState([]);
  const [resto, setResto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingData, setBookingData] = useState({
    selectedMenu: "",
    people: 2,
    date: "",
    timeSlot: "",
    discount: 0,
  });

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
  useEffect(() => {
    const fetchSlots = async () => {
      const response = await getSlotListByRestaurant(id);

      setTimeSlots(response.data.data);
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

  const staticRating = 4.5;
  const staticReviewCount = 127;

  const tabs = [
    { id: "overview", label: "Overview", icon: Utensils },
    { id: "menu", label: "Menu Items", icon: Utensils },
    { id: "photos", label: "Photos", icon: Camera },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={
            resto.mainImage ||
            "https://via.placeholder.com/1200x400?text=Restaurant+Image"
          }
          alt={resto.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/1200x400?text=Restaurant+Image";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition duration-200 z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Restaurant Name and Logo - Bottom Left */}
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
        <div className="absolute bottom-6 right-6 bg-white bg-opacity-95 px-6 py-3 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-orange-500 fill-current" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl text-gray-800">
                  {staticRating}
                </span>
                <span className="text-gray-600">
                  ({staticReviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= staticRating
                        ? "text-orange-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
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
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition duration-200 whitespace-nowrap ${
                        activeTab === tab.id
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
                      About {resto.name}
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
                        {formatClosedDates(resto.closedDates)}
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

              {activeTab === "reviews" && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Customer Reviews
                  </h3>
                  <p className="text-gray-500">
                    Reviews will be displayed here.
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
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots?.map((time) => (
                    <button
                      key={time.timeSlot}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          timeSlot: time.timeSlot,
                        })
                      }
                      className={`px-3 py-2 text-sm  rounded-lg border transition duration-200 ${
                        bookingData.timeSlot === time
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                      }`}
                    >
                      {time.timeSlot}
                    </button>
                  ))}
                </div>
              </div>
              {/* Number of People */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of People
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      setBookingData({
                        ...bookingData,
                        people: Math.max(1, bookingData.people - 1),
                      })
                    }
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition duration-200"
                  >
                    -
                  </button>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-semibold">
                      {bookingData.people}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setBookingData({
                        ...bookingData,
                        people: bookingData.people + 1,
                      })
                    }
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                disabled={!bookingData.date || !bookingData.timeSlot}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
              >
                Book Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestoDetails;
