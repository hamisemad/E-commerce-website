import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./components/Context/AuthContext";
import CartProvider from "./components/Context/CartContext";
import WishListProvider from "./components/Context/WishListContext.jsx";
import { HelmetProvider } from "react-helmet-async";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>

      <AuthProvider>
        <CartProvider>
          <WishListProvider>
            <App />
          </WishListProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider >

  </React.StrictMode>
);
