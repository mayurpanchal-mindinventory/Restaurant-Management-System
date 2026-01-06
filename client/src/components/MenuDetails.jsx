import { useEffect, useState } from "react";
import { getMenuList, getMenuList1 } from "../services/adminService";

function MenuDetails({ id }) {
  const [item, setItem] = useState(null);
  useEffect(() => {
    const fetchMenu = async (id) => {
      const response = await getMenuList1(id);
      console.log(response);
      setItem(response.data.data.menuData);
    };
    fetchMenu(id);
  }, []);

  return (
    <>
      <div className="p-4 bg-gray-50">
        {" "}
        {item && Array.isArray(item) && item.length > 0 ? (
          item.map((i) => (
            <div
              key={i.id || i._id || `${i.name}-${i.price}`}
              className="flex w-full items-center bg-white shadow-sm rounded-lg overflow-hidden mb-3 p-2 border border-gray-100 hover:shadow-md hover:border-orange-400 transition duration-300 cursor-pointer"
            >
              <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={i?.image || "https://placehold.co/600x400"}
                  alt={`${i.name || "Product"} image`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-row w-full px-5  gap-10 ml-4 justify-between items-baseline">
                <div className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-700">
                    {i.name || "Unnamed Product"}
                  </h2>
                  <p className="bg-orange-100 text-orange-500 h-fit px-1 w-fit rounded-full text-xs">
                    {i.categoryId.categoryName}
                  </p>
                </div>

                <p className="text-lg font-bold text-orange-600 mt-1">
                  ₹{i.price ? parseFloat(i.price).toFixed(2) : "N/A"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-gray-500 text-center py-8">
            No menu items available
          </h2>
        )}
      </div>
    </>
  );
}
export default MenuDetails;
