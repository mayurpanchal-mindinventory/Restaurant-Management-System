import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, Filter, MapPin, ArrowLeft, ChevronDown } from "lucide-react";
import { getAllMenu } from "../services/adminService";
import { toast } from "react-hot-toast";
import bookingImg from "../assets/booking.jpg";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

const PublicMenu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuData, setMenuData] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  });

  // Set search term from URL parameters when component loads
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);
  const searchTimeoutRef = useRef(null);
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchTerm,
        category,
        restaurant,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sortBy,
        sortOrder: sortBy.includes("desc") ? "desc" : "asc",
        page: pagination.currentPage,
        limit: pagination.limit,
      };
      const response = await getAllMenu(filters);

      console.log("new", response);

      if (response) {
        setMenuData(response.data.data.groupedData || []);
        setAllMenuItems(response.data.data.flatData || []);

        if (response?.data?.data?.pagination) {
          // console.log(response.data.data.pagination);
          setPagination((prev) => ({
            ...prev,
            ...response.data.data.pagination,
          }));
        }

        if (allMenuItems.length === 0 && response.data.flatData) {
          const prices = response.data.flatData.map((item) => item.price);
          if (prices.length) {
            setPriceRange({
              min: Math.min(...prices),
              max: Math.max(...prices),
            });
          }
        }
      }
    } catch (err) {
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    category,
    restaurant,
    sortBy,
    priceRange,
    pagination.currentPage,
    allMenuItems.length,
  ]);

  // Debounce search/filter updates
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchData();
    }, 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm, category, restaurant, sortBy, priceRange]);

  useEffect(() => {
    fetchData();
  }, [pagination.currentPage]);

  const categories = useMemo(() => {
    return [...new Set(allMenuItems.map((item) => item.categoryName))]
      .filter(Boolean)
      .sort();
  }, [allMenuItems]);

  const restaurants = useMemo(() => {
    return [...new Set(allMenuItems.map((item) => item.restaurantName))]
      .filter(Boolean)
      .sort();
  }, [allMenuItems]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setRestaurant("");
    setSortBy("name");
    if (allMenuItems.length > 0) {
      const prices = allMenuItems.map((item) => item.price);
      setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    } else {
      setPriceRange({ min: 0, max: 1000 });
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <>
      <div
        className="relative h-64 w-full overflow-hidden bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bookingImg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute z-20 top-20 left-6 bg-white hover:bg-orange-500 hover:text-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-8  top-20 w-full flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl font-bold text-white">
            Search <span className="text-orange-500">Menu</span>
          </h1>
          <p className="text-gray-200 mt-2 text-sm uppercase tracking-widest text-center">
            Search your favaourate restanrant and menus
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search dishes, restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative inline-block w-full md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none w-full bg-white px-4 py-2 pr-10 border border-slate-200 rounded-xl shadow-sm text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300 cursor-pointer hover:bg-slate-50"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          <div className="relative inline-block w-full md:w-64">
            <select
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              className="appearance-none w-full bg-white px-4 py-2 pr-10 border border-slate-200 rounded-xl shadow-sm text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300 cursor-pointer hover:bg-slate-50"
            >
              <option value="">All Restaurants</option>
              {restaurants.map((rest) => (
                <option key={rest} value={rest}>
                  {rest}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
          <div className="relative inline-block w-full md:w-64">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full bg-white px-4 py-2 pr-10 border border-slate-200 rounded-xl shadow-sm text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300 cursor-pointer hover:bg-slate-50"
            >
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-low">Price Low - High</option>
              <option value="price-high">Price High - Low</option>
              <option value="category">Category</option>
              <option value="restaurant">Restaurant</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 p-2 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Price:</span>

            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handlePriceChange}
                className="w-16 outline-none text-sm bg-transparent"
              />
              <span className="text-gray-300 mx-2">|</span>
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handlePriceChange}
                className="w-16 outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm font-medium text-gray-500 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        <div className="mb-6 text-gray-600">
          <p>
            Showing {allMenuItems.length} of {pagination.totalDocs} items
            {pagination.totalPages > 1 &&
              ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
          </p>
        </div>

        {allMenuItems.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="mx-auto mb-4" size={48} color="gray" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allMenuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg flex transition p-4"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                  <img
                    src={item.image || "/placeholder-food.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/placeholder-food.jpg")}
                  />
                </div>
                <div className="flex-1 flex justify-between items-start ml-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{item.restaurantName}</span>
                    </div>
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                      {item.categoryName}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xl font-bold mb-2">₹{item.price}</p>
                    <NavLink
                      to="/Home/restaurant"
                      state={{ id: item.restaurantId }}
                    >
                      <button
                        className={`text-sm font-semibold text-orange-500  hover:text-orange-600 transition duration-200`}
                      >
                        View Details
                      </button>
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {console.log(pagination)}
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5 || pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={`px-3 py-2 border rounded-lg text-sm transition ${pageNum === pagination.currentPage
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {pageNum}
                </button>
              );
            }
          )}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PublicMenu;
