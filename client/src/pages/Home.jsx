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
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="relative h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${img1})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-4 leading-tight">
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

            <div className="w-full max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search for restaurants, cuisines, or dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 text-lg rounded-l-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-r-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
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
    </>
  );
}

export default Home;
