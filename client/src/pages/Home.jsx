import img1 from "../assets/img1.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PizzaRow from "../components/PizzaRow";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import Brands from "../components/Brands";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Navigate to menu page with search term
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="relative h-[600px]">
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${img1})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="mb-8 ">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white md:mt-0 mt-40 mb-4 leading-tight">
                Book Tables & Order In:
                <span className="block text-orange-400">
                  Your Local Dining Guide
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                Explore dining options, view menus, and secure your reservation
                online for a seamless experience.
              </p>
            </div>

            <div className="w-full max-w-2xl px-4 sm:px-0">
              <form onSubmit={handleSearch} className="w-full">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-white sm:bg-transparent rounded-2xl sm:rounded-full p-2 sm:p-0 shadow-lg sm:shadow-none">
                  <input
                    type="text"
                    placeholder="Search restaurants, dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-5 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-l-full border sm:border-0 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
                  />

                  <button
                    type="submit"
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl sm:rounded-r-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95"
                  >
                    <span className="sm:inline">Search</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-0 md:mt-8 flex flex-wrap justify-center gap-4 invisible md:visible">
              {[
                "Pizza",
                "Burgers",
                "Sushi",
                "Indian",
                "Chinese",
                "Italian",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchQuery(category)}
                  className="px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 rounded-full transition duration-200 backdrop-blur-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white z-20">
          <div className="   w-full flex justify-center items-center rounded-lg -mt-[50px] z-20 relative">
            <PizzaRow />
          </div>

          <div className="w-full ">
            <FeaturedRestaurants />
          </div>

          <div>
            <Brands />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
