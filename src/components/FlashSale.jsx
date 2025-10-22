import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Sale from "../assets/icons/sale-tag-for-online-shops-svgrepo-com.svg";
import { useWishList } from "./Context/WishListContext";
import { useCart } from "./Context/CartContext";



function FlashSale() {
  const [flashSale, setFlashSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });


  const { addProductToCart } = useCart();
  const { addProductToWishList } = useWishList();

  const CountDownDate = new Date().getTime() + 24 * 60 * 60 * 1000;

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/products"
        );
        const allProducts = response.data.data;
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 15);
        setFlashSale(randomProducts);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = CountDownDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full mx-auto my-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-600 mb-6 animate-pulse">
            Flash Sale!
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-semibold mb-4">
            Limited-time deals ending in..
          </p>

          {/* Countdown Display */}
          <div className="flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 bg-gray-200 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl min-w-[45px] sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px] shadow-inner text-center">
                {countdown.days}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mt-1">
                Days
              </span>
            </div>

            <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 font-bold">:</span>

            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 bg-gray-200 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl min-w-[45px] sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px] shadow-inner text-center">
                {countdown.hours}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mt-1">
                Hours
              </span>
            </div>

            <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 font-bold">:</span>

            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 bg-gray-200 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl min-w-[45px] sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px] shadow-inner text-center">
                {countdown.minutes}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mt-1">
                Minutes
              </span>
            </div>

            <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 font-bold">:</span>

            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 bg-gray-200 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl min-w-[45px] sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px] shadow-inner text-center">
                {countdown.seconds}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mt-1">
                Seconds
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 md:px-14">
            {Array(10)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-3"
                >
                  <Skeleton height={150} className="mb-3 rounded-md" />
                  <Skeleton height={20} width="80%" className="mb-2" />
                  <Skeleton height={20} width="40%" />
                </div>
              ))}
          </div>

        ) : error ? (
          <div className="text-center text-xl text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-10 cursor-pointer">
            {flashSale.map((product) => (
              <Link to={`/product/${product._id}`}

                key={product.id}
                className="relative border bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >

                <div className="relative w-full aspect-w-1 aspect-h-1">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-contain"
                  />
                  <div className="absolute top-0 -left-5">
                    <img src={Sale} alt="New" className="w-10" />
                  </div>

                  <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    <div className="bg-gray-100 rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addProductToWishList(product._id);


                      }}
                    >
                      <Heart className="text-purple-700 sm:w-6 w-4 " />

                    </div>
                    <div className="bg-gray-100 rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-200 absolute sm:top-72 top-20"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addProductToCart(product._id);

                      }}
                    >
                      <ShoppingCart className="text-purple-700 sm:w-6 w-4  " />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-4 truncate">
                    {product.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between">
                    <span className="text-sm md:text-base font-bold text-gray-800">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs md:text-sm text-gray-400 line-through ">
                      ${(product.price * 1.5).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-1 text-gray-400">
                      ({product.ratingsQuantity || 0})
                    </span>
                  </div>
                  <p className="text-[11px] md:text-xs mt-5 text-red-500 font-semibold mb-1">
                    LIMITED STOCK
                  </p>


                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashSale;
