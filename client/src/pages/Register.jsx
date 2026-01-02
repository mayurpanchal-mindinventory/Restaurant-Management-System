import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import toast from "react-hot-toast";

function Register() {
  const [regiValue, setRegiValue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    const { name, value } = e.target;
    setRegiValue((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Name should only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return;
  };

  const validatePhone = (phone) => {
    if (phone && phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
      if (cleanPhone.length < 10) {
        return "Phone number should be at least 10 digits";
      }
      if (!phoneRegex.test(cleanPhone)) {
        return "Please enter a valid phone number";
      }
    }
    return;
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return;

  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(regiValue.name),
      email: validateEmail(regiValue.email),
      phone: validatePhone(regiValue.phone),
      password: validatePassword(regiValue.password),
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

    const userData = {
      name: regiValue.name.trim(),
      email: regiValue.email.trim(),
      phone: regiValue.phone.trim(),
      password: regiValue.password,
    };

    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate("/");
      toast.success("Registration successful! Please log in.");
    } catch (err) {
      console.log(err);

      if (err?.response?.data?.error)
        toast.error(err.response.data.error);
    }
  };

  return (
    <>
      <div className=" border p-8 rounded-3xl w-full max-w-md shadow-md ">
        <h2 className="text-black font-bold title-font mb-5">Register here</h2>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={regiValue.name}
              onChange={handleRegister}
              placeholder="Enter your full name"
              className={`w-full text-black rounded border transition-colors duration-200 text-base outline-none py-2 px-3 leading-8 ${errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "focus:border-orange-500 focus:ring-orange-200"
                } focus:ring-2`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={regiValue.email}
              onChange={handleRegister}
              placeholder="Enter your email address"
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
            <label htmlFor="phone" className="leading-7 text-sm text-gray-700">
              Phone Number{" "}

            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={regiValue.phone}
              onChange={handleRegister}
              placeholder="Enter your phone number"
              className={`w-full text-black rounded border transition-colors duration-200 text-base outline-none py-2 px-3 leading-8 ${errors.phone
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "focus:border-orange-500 focus:ring-orange-200"
                } focus:ring-2`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
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
              value={regiValue.password}
              onChange={handleRegister}
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
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          <p className="text-sm  text-dark mt-4 text-center">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-orange-400 hover:text-orange-300 underline font-medium"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
export default Register;
