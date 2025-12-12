import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { useAuthInit } from "./hooks/useAuthInit";

// Component to initialize auth state
const AuthInitializer = ({ children }) => {
  useAuthInit();
  return children;
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </Provider>
  </BrowserRouter>
);
