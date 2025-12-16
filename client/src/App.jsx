import { Routes, Route } from "react-router-dom";
import LoginLayout from "./components/layout/LoginLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./components/layout/AdminLayout";
import Restaurant from "./pages/Restaurant";
import AddRestaurant from "./pages/AddRestaurant";
import Menu from "./pages/Menu";
import MenuList from "./pages/MenuList";
import Slot from "./pages/Slot";

function App() {
  return (
    <>
      {" "}
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginLayout />}>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="add" element={<AddRestaurant />} />
          <Route path="add/:id" element={<AddRestaurant />} />
          <Route path="menu/:id" element={<MenuList />} />
          <Route path="addmenu/:id" element={<Menu />} />
          <Route path="editmenu/:id" element={<Menu />} />
          <Route path="slot/:id" element={<Slot />} />

          <Route index element={<Restaurant />} />
        </Route>

        <Route path="Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
