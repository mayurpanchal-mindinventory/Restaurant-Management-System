import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { Star } from "lucide-react";
import { NavLink } from "react-router-dom";

const brandColor = "text-orange-500";
const brandBgColor = "bg-orange-500";
const subtleOrangeBg = "bg-orange-100";
const subtleOrangeText = "text-orange-600";

const RestaurantCard = ({ restaurant }) => {
  const staticRating = 4.5;
  const staticDiscount = 20;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:shadow-xl transition duration-300 border border-gray-100">
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={restaurant.mainImage || "via.placeholder.com"}
          alt={restaurant.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "via.placeholder.com";
          }}
        />

        <div
          className={`absolute top-3 left-3 ${subtleOrangeBg} ${subtleOrangeText} px-3 py-1 rounded-full text-xs font-bold shadow-md`}
        >
          {staticDiscount}% OFF
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between h-[150px]">
        <div>
          <h3 className="text-xl font-bold text-gray-800 truncate mb-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {restaurant.description ||
              "Authentic and mouth-watering cuisine awaits you!"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <Star className={`w-4 h-4 ${brandColor} fill-current`} />
            <span className="text-base font-semibold text-gray-800">
              {staticRating}
            </span>
          </div>

          <NavLink to="Home/restaurant">
            <button
              className={`text-sm font-semibold ${brandColor} hover:text-orange-600 transition duration-200`}
            >
              View Details
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const response = await apiClient.getFeaturedRestaurants();
        setRestaurants(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants");
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const sectionPadding = "px-4 md:px-14 py-12";

  if (loading) {
    return (
      <div className={`${sectionPadding} bg-gray-50`}>
        <h2 className="text-3xl  font-bold text-gray-900 mb-6">
          Featured Restaurants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-full h-[360px] bg-gray-200 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${sectionPadding}`}>
        <h2 className="text-3xl  text-gray-900 mb-6">Featured Restaurants</h2>
        <div className="text-center text-red-600 py-8 border border-red-300 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${sectionPadding} bg-gray-50`}>
        <div className="mb-8">
          <div className="loader-line"></div>
          <h2 className="text-4xl  font-medium text-gray-900">
            Featured Restaurants
          </h2>

          <p className="text-gray-500 mt-2 text-lg">
            Discover amazing restaurants near you
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm">
            No featured restaurants available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FeaturedRestaurants;
