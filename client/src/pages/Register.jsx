import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";

function Register() {
  const [regiValue, setRegiValue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    const { name, value } = e.target;
    setRegiValue((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: regiValue.name,
      email: regiValue.email,
      phone: regiValue.phone,
      password: regiValue.password,
    };

    try {
      await dispatch(registerUser(userData)).unwrap();

      navigate("/");
      alert("Registration successful! Please log in.");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <>
      <div className=" border p-8 rounded-3xl w-full max-w-md shadow-md ">
        <h2 className="text-black font-bold title-font mb-5">Register here</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm "></label>
            <input
              type="text"
              id="name"
              name="name"
              value={regiValue.name}
              onChange={handleRegister}
              placeholder="Name"
              className="w-full  text-black rounded border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none  py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              required
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm "></label>
            <input
              type="email"
              id="email"
              name="email"
              value={regiValue.email}
              onChange={handleRegister}
              placeholder="email"
              className="w-full  text-black rounded border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none  py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              required
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="phone" className="leading-7 text-sm "></label>
            <input
              type="phone"
              id="phone"
              name="phone"
              value={regiValue.phone}
              onChange={handleRegister}
              placeholder="Phone Number"
              className="w-full  text-black rounded border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none  py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm "></label>
            <input
              type="password"
              id="password"
              name="password"
              value={regiValue.password}
              onChange={handleRegister}
              placeholder="•••••••••"
              className="w-full  text-black rounded border  focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none  py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              required
            />
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
