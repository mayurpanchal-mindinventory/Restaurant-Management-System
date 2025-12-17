import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { logout } from "../../slices/authSlice";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/menu", label: "Menu" },
  { path: "bookings", label: "Bookings" },
  { path: "/about", label: "About Us" },
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const profileRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const getInitials = (u) => {
    if (!u?.name) return u?.email?.[0].toUpperCase() || "U";
    const parts = u.name.trim().split(" ");
    return (
      parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0]
    ).toUpperCase();
  };

  const getLinkStyle = (path) => {
    const active = pathname === path;
    const scrollColor = isScrolled ? "text-gray-700" : "text-white";
    return `relative font-semibold transition-all ${
      active ? "text-orange-500" : `${scrollColor} hover:text-orange-500`
    }`;
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div
          onClick={() => handleNav("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-orange-500 p-1.5 rounded-lg ">🍽️</div>
          <h1
            className={`text-2xl font-black ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            FOODIE<span className="text-orange-500">HUB</span>
          </h1>
        </div>

        <nav className="hidden lg:flex items-center space-x-10">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={getLinkStyle(link.path)}
            >
              {link.label}
              {pathname === link.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                  {getInitials(user)}
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    {user.role === "admin" && (
                      <button
                        onClick={() => handleNav("/admin")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                      >
                        <LayoutDashboard size={16} /> Admin
                      </button>
                    )}
                    <button
                      onClick={() => {
                        dispatch(logout());
                        handleNav("/");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => handleNav("/login")}
                className={`px-4 py-2 font-bold ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleNav("/register")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-transform active:scale-95"
              >
                Join
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t p-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`w-full text-left p-3 rounded-lg font-bold ${
                pathname === link.path
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
