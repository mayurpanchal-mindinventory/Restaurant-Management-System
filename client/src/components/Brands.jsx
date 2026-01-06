import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import leaf from "../assets/leaf.svg";

function Brands() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getFeaturedRestaurants();
        setRestaurants(response.data.data.restaurants || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <section className="bg-white">
      <div className="px-6 md:px-14 py-12 max-w-7xl mx-auto">
        <div className="relative mb-10">
          <div className="loader-line"></div>
          <h2 className="text-4xl  font-medium text-gray-900">Brand For You</h2>

          <p className="text-gray-500 mt-2 text-lg">
            Browse out top brands here to discover different food cuision.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 rounded-xl">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-1 md:gap-12">
            {restaurants.map((item, index) => (
              <div
                key={item._id || index}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-100 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300 -z-10"></div>
                  <img
                    src={item.logoImage}
                    alt={item.name}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain bg-white border border-gray-100 rounded-full shadow-sm p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm md:text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-gray-400 text-lg italic">
              Currently no brands available
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}

export default Brands;
