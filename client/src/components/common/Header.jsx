import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/authSlice";

function Header(params) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      <div className="flex bg-gray-400 text-white px-20 p-8 md:flex-row  justify-between">
        <div>
          <h1>logo</h1>
        </div>
        <div className="">
          <ul className="flex flex-row gap-10">
            <li>Home</li>
            <li>Menu</li>
            <li>Bookings</li>
            <li>About us</li>
          </ul>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="mt-4 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded text-lg font-semibold transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
export default Header;
