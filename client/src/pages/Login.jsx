import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import toast from "react-hot-toast";

function Login() {
  const [loginValue, setLoginValue] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/AdminLayout");
      } else {
        navigate("/Home");
        toast.success("Successfully Log-in!");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setLoginValue((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginValue.email.trim() === "" || loginValue.password.trim() === "") {
      toast("Please enter valid email and password.");
      return;
    }

    const credentials = {
      email: loginValue.email,
      password: loginValue.password,
    };

    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed!");
    }
  };

  return (
    <>
      <div className=" border p-8 rounded-3xl w-full max-w-md shadow-md ">
        <h2 className="text-black font-bold title-font mb-5">Log-In here</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginValue.email}
              onChange={handleLogin}
              placeholder="email"
              className="w-full  text-black rounded border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none  py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              required
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm ">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginValue.password}
              onChange={handleLogin}
              placeholder="•••••••••"
              className="w-full  text-black rounded border  focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none  py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading} // Disable button while loading
            className="text-white bg-orange-500 border-0 py-2 px-8 w-full focus:outline-none hover:bg-orange-700 rounded text-lg font-semibold transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Submit"}
          </button>

          <p className="text-sm  text-dark mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-400 hover:text-orange-300 underline font-medium"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
export default Login;
