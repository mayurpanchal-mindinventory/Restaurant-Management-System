import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import leaf from "../assets/leaf.svg";
function Brands(params) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const response = await apiClient.getFeaturedRestaurants();
        setRestaurants(response.data.data.restaurants || []);
        // console.log(response?.data?.data?.logoImage);
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

  const img = <img src={leaf} />;
  return (
    <>
      <div className="px-4 md:px-14 py-12 ">
        <div className="mb-8">
          <div className="loader-line"></div>
          <h2 className="text-4xl  font-medium text-gray-900">Brand For You</h2>

          <p className="text-gray-500 mt-2 text-lg">
            Browse out top brands here to discover different food cuision.
          </p>
        </div>
      </div>
      <div className="flex flex-row  items-center justify-center overflow-hidden bg-[]">
        {restaurants.length > 0 ? (
          restaurants.map((item) => {
            return (
              <>
                {" "}
                <div className="flex flex-col px-10 border-r-2   items-center justify-center ">
                  <img
                    src={item.logoImage}
                    className="w-24 h-24  object-contain border-1 rounded-full"
                  />
                  <p>{item.name}</p>
                </div>
              </>
            );
          })
        ) : (
          <h1>currently no brands</h1>
        )}
      </div>
    </>
  );
}
export default Brands;
