import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

function HomeLayout(params) {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
export default HomeLayout;
