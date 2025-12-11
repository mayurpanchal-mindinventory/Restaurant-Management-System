import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <div className="p-8">
        <h1>Welcome to the home page, {user?.name || user?.email}!</h1>
        <p>You are logged in.</p>

        <button
          onClick={handleLogout}
          className="mt-4 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded text-lg font-semibold transition duration-200"
        >
          Logout
        </button>
      </div>
    </>
  );
}
export default Home;
