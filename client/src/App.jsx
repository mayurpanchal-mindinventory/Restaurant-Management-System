import { Routes, Route } from "react-router-dom";
import LoginLayout from "./components/layout/LoginLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

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
        <Route path="Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
