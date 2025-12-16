import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../../slices/authSlice";

function Header(params) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  //Header show and hide
  const changeNavbarColor = () => {
    if (window.scrollY >= 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavbarColor);
    return () => {
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logout());
    console.log("User after logout:", user);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/*backdrop-blur-md is tailwind method i have used to blur background while we scroll*/}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? " backdrop-blur-3xl shadow-lg py-3 "
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1
                className="text-2xl lg:text-3xl font-bold text-orange-500 cursor-pointer"
                onClick={() => navigate("/")}
              >
                🍽️ FoodieHub
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation("/")}
                className={`hover:text-orange-500 font-medium transition duration-200 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("/menu")}
                className={`hover:text-orange-500 font-medium transition duration-200 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => handleNavigation("/bookings")}
                className={`hover:text-orange-500 font-medium transition duration-200 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => handleNavigation("/about")}
                className={`hover:text-orange-500 font-medium transition duration-200 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                About Us
              </button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className={`hover:text-orange-500 font-medium transition duration-200 ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`focus:outline-none ${
                  isScrolled
                    ? "text-gray-700 hover:text-orange-500"
                    : "text-white hover:text-orange-500"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => handleNavigation("/")}
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-200 text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/menu")}
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-200 text-left"
                >
                  Menu
                </button>
                <button
                  onClick={() => handleNavigation("/bookings")}
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-200 text-left"
                >
                  Bookings
                </button>
                <button
                  onClick={() => handleNavigation("/about")}
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-200 text-left"
                >
                  About Us
                </button>

                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="flex flex-col space-y-4">
                      <span className="text-gray-700 font-medium">
                        Welcome, {user.name || user.email}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition duration-200 text-left"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="text-gray-700 hover:text-orange-500 font-medium transition duration-200 text-left"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleNavigation("/register")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition duration-200 text-left"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
