import { Outlet } from "react-router-dom";
import Header from "../common/Header";

function HomeLayout(params) {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
export default HomeLayout;
