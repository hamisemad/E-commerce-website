import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";
import Subcategories from "./components/Subcategories";
import ProductDetails from "./components/ProductDetails";
import NotFound from "./components/NotFound";
import Cart from "./components/Cart.jsx";
import Register from "./components/Register.jsx";
import { Toaster } from "react-hot-toast";
import WishList from "./components/WishList.jsx";
import CheckOutPage from './components/CheckOut/CheckOutPage.jsx';
import CartSidebar from "./components/CartSidebar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Navbar />
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#6248EA",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "16px 24px",
            fontWeight: "500",
          },
        }}
      />
      <CartSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:categoryId" element={<Subcategories />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/checkout" element={<CheckOutPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
