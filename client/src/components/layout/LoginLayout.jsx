import { NavLink, Outlet } from "react-router-dom";
import LoginImg from "../../assets/LoginImg.jpg";
function LoginLayout(params) {
  const getNavLinkClasses = ({ isActive }) => {
    let classes =
      "flex items-center justify-center w-full rounded-lg transition-colors duration-200 text-black ";

    if (!isActive) {
      classes += "hover:bg-gray-100  hover:text-gray-900 ";
    } else {
      classes += "bg-orange-500 text-white  font-semibold shadow-sm";
    }
    return classes;
  };
  return (
    <>
      <div className="w-full flex flex-col md:flex-row bg-white items-center ">
        <div className="md:w-1/2  object-contain ">
          <img src={LoginImg} className=" w-full object-cover h-screen" />
        </div>
        <div className=" mx-10 md:w-1/2 md:h-full md:p-0 p-4 flex flex-col items-center justify-center text-black">
          <div></div>
          <div className="p-4 text-center">
            <h2 className="text-3xl mt-1 font-bold  text-black mb-2">
              <span className="text-orange-400">Welcome back!</span> Your next
              bite awaits.🍜
            </h2>
            <p className=" text-black">Login for deliciousness.</p>
          </div>
          <div className=" mb-5 flex w-full rounded-xl max-w-md flex-row justify-around border-2 text-xl">
            <NavLink className={getNavLinkClasses} to="/">
              <button className="p-1">Login</button>
            </NavLink>
            <NavLink className={getNavLinkClasses} to="/register">
              <button className="p-1">Register</button>
            </NavLink>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default LoginLayout;
