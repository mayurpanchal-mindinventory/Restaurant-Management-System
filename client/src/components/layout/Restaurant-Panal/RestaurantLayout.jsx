import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../Restaurant-Panal/SidebarAdmin";
import { useSelector } from "react-redux";

function RestaurantLayout(params) {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div className="flex flex-row ">
        <div>
          <SidebarAdmin />
        </div>
        <div className=" flex w-full h-screen justify-center items-center">
          <div className=" flex flex-col items-center justify-center">
            <h1 className="font-semibold text-4xl">
              Welcome <span className="text-orange-500">{user.username}!!</span>
            </h1>
            <p className="font-thin text-2xl text-center items-center justify-center">
              Control Your Happy Customers Booking ,Billing & Menu's <br />{" "}
              Wishing You Great Day.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default RestaurantLayout;
