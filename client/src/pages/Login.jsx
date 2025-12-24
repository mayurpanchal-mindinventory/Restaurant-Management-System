import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import toast from "react-hot-toast";

function Login() {
  const [loginValue, setLoginValue] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      let redirectPath = "/home";
      console.log("User object:", user);

      if (user.role === "admin") {
        redirectPath = "/admin";
      } else if (user.role === "restaurant") {
        redirectPath = "/restaurant/restaurant/booking";
      }

      navigate(redirectPath);
      toast.success("Successfully Log-in!");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setLoginValue((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(loginValue.email),
      password: validatePassword(loginValue.password),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessages = Object.values(errors);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      }
      return;
    }

    const credentials = {
      email: loginValue.email.trim(),
      password: loginValue.password,
    };

    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (err) {
      console.error("Login failed:", err);

      toast.error(
        "There was an error while logging in. Please check your credentials and try again."
      );
    }
  };

  return (
    <>
      <div className=" border p-8 rounded-3xl w-full max-w-md shadow-md ">
        <h2 className="text-black font-bold title-font mb-5">Log-In here</h2>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginValue.email}
              onChange={handleLogin}
              placeholder="Enter your email"
              className={`w-full text-black rounded border transition-colors duration-200 text-base outline-none py-2 px-3 leading-8 ${errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "focus:border-orange-500 focus:ring-orange-200"
                } focus:ring-2`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginValue.password}
              onChange={handleLogin}
              placeholder="Enter your password"
              className={`w-full text-black rounded border transition-colors duration-200 text-base outline-none py-2 px-3 leading-8 ${errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "focus:border-orange-500 focus:ring-orange-200"
                } focus:ring-2`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
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
