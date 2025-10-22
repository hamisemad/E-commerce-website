import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import { useCart } from "./Context/CartContext";
import { useWishList } from "./Context/WishListContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { WishListCount } = useWishList();
  const [userMenu, setUserMenu] = useState(false);
  const [mobileUserMenu, setMobileUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://ecommerce.routemisr.com/api/v1/categories")
      .then(res => setCategories(res.data.data))
      .catch(err => console.error("Category error:", err));
    axios.get("https://ecommerce.routemisr.com/api/v1/products")
      .then(res => setProducts(res.data.data))
      .catch(err => console.error("Products error:", err));
  }, []);

  useEffect(() => {
    setResults(query.trim() ? products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : []);
  }, [query, products]);

  const handleSearch = e => {
    e.preventDefault();
    if (!query.trim()) return;
    if (results.length === 0) navigate("/not-found");
    else if (results.length === 1) navigate(`/product/${results[0]._id}`);
    setIsSearchOpen(false); setQuery(""); setResults([]);
  };

  const NavButton = ({ to, icon: Icon, count, label }) => (
    <Link to={to} className="relative flex flex-col items-center text-gray-700 hover:text-purple-600 transition">
      <Icon size={24} />
      <span className="text-xs mt-0.5">{label}</span>
      {count > 0 && <span className="absolute bg-yellow-500 text-purple-950 text-xs font-bold rounded-full w-5 h-5 -top-1 right-2 flex items-center justify-center border-2 border-white">{count}</span>}
    </Link>
  );

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-900 text-white shadow-xl rounded-b-xl">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1 rounded-full hover:bg-white/10 ">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-3xl font-extrabold tracking-wide text-white">Super<span className="text-yellow-300">Kart</span></Link>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden md:hidden p-1 rounded-full hover:bg-white/10"><Search size={24} /></button>
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-lg">
              <input className="flex-grow px-2 text-black bg-transparent focus:outline-none" placeholder="Search for Products..." value={query} onChange={e => setQuery(e.target.value)} />
              <button type="submit"><Search className="text-gray-600 hover:text-gray-800 " size={20} /></button>
            </form>
            {results.length > 0 && query.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-gray-800 rounded-xl shadow-2xl max-h-80 overflow-y-auto p-2 z-50">
                {results.slice(0, 5).map(p => (
                  <Link key={p._id} to={`/product/${p._id}`} onClick={() => { setQuery(""); setResults([]); }} className="flex items-center p-3 hover:bg-gray-100 rounded-lg border-b">
                    <img src={p.imageCover} alt={p.title} className="w-10 h-10 object-cover rounded-md mr-3" onError={e => e.target.src = "https://placehold.co/40x40/cccccc/333333?text=N/A"} />
                    <div className="truncate text-sm font-medium">{p.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 ">
            <div className="cursor-pointer bg-inherit p-1 rounded-full hover:bg-white/10 transition-colors select-none"><Link to="/wishlist" className="relative hidden sm:block"><Heart size={24} className="text-white" />{WishListCount > 0 && <span className="absolute bg-yellow-500 text-purple-950 text-xs font-bold rounded-full w-4 h-4 -top-1 -right-2 flex items-center justify-center border-2 border-white">{WishListCount}</span>}</Link></div>
            <div className="cursor-pointer bg-inherit p-1 rounded-full hover:bg-white/10 transition-colors select-none"> <Link to="/cart" className="relative hidden sm:block"><ShoppingCart size={24} className="text-white" />{cartCount > 0 && <span className="absolute bg-yellow-500 text-purple-950 text-xs font-bold rounded-full w-4 h-4 -top-1 -right-2 flex items-center justify-center border-2 border-white">{cartCount}</span>}</Link></div>

            <div className="relative hidden sm:block cursor-pointer bg-inherit p-1 rounded-full hover:bg-white/10 transition-colors select-none">
              {!user ? (
                <Link to="/register" className="flex items-center gap-2"><User size={24} className="text-white" /></Link>
              ) : (
                <div onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 cursor-pointer">
                  <User size={22} /><span>Hello, {user.name || "User"}</span>
                  {userMenu && (
                    <div className="absolute right-0 mt-20 bg-white text-gray-800 rounded-lg shadow-xl w-36 py-1 z-50">
                      <button onClick={() => { logout(); setUserMenu(false); }} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-sm font-medium">
                        <LogOut className="w-4 h-4 mr-2" />Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden w-full px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-900 shadow-md relative">
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-inner">
              <input className="flex-grow px-2 text-black bg-transparent focus:outline-none" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
              <button type="submit"><Search size={20} /></button>
            </form>
            {results.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-white text-gray-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2 z-50">
                {results.slice(0, 5).map(p => (
                  <Link key={p._id} to={`/product/${p._id}`} onClick={() => { setQuery(""); setResults([]); setIsSearchOpen(false); }} className="flex items-center p-3 hover:bg-gray-100 rounded-lg border-b">
                    <img src={p.imageCover} alt={p.title} className="w-8 h-8 object-cover rounded-md mr-2" />
                    <div className="truncate text-sm font-medium">{p.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="hidden lg:flex bg-gradient-to-r from-blue-600 via-purple-600 to-pink-900 px-6 py-2.5 border-t border-white/20">
          <div className="flex flex-wrap justify-center gap-5 text-lg font-medium w-full max-w-7xl mx-auto">
            {categories.map(cat => <Link to={`/categories/${cat._id}`} key={cat._id} className="hover:text-yellow-300 text-white">{cat.name}</Link>)}
          </div>
        </div>

        <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-gradient-to-r from-blue-700 to-purple-700 w-64 h-full shadow-2xl p-6">
            <button className="p-1 rounded-full hover:bg-white/20 mb-6" onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
            <ul className="flex flex-col gap-4 text-xl">
              <h3 className="text-sm font-bold uppercase text-yellow-300 mb-2 border-b pb-1">Shop by Category</h3>
              {categories.map(cat => (
                <li key={cat._id}><Link to={`/categories/${cat._id}`} onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-300 text-white">{cat.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl sm:hidden">
        <div className="flex justify-around items-center h-16">
          <NavButton to="/" icon={Home} label="Home" />
          <NavButton to="/wishlist" icon={Heart} label="Wishlist" count={WishListCount} />
          <NavButton to="/cart" icon={ShoppingCart} label="Cart" count={cartCount} />
          {!user ? (
            <NavButton to="/register" icon={User} label="Sign In" />
          ) : (
            <div className="relative">
              <button onClick={() => setMobileUserMenu(!mobileUserMenu)} className="flex flex-col items-center text-gray-700 hover:text-purple-600">
                <User size={24} /><span className="text-xs mt-0.5">Account</span>
              </button>
              {mobileUserMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 rounded-lg shadow-2xl w-36 py-1 z-50">
                  <button onClick={() => { logout(); setMobileUserMenu(false); }} className="flex items-center w-full px-4 py-2 text-red-600 text-sm font-medium hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-2" />Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
