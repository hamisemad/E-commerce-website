import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { useCart } from "./Context/CartContext";
import { useWishList } from "./Context/WishListContext";



function BestSellers() {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addProductToCart } = useCart();
  const { addProductToWishList } = useWishList();


  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/products"
        );
        const selectedProducts = response.data.data.splice(0, 15);
        setBestsellers(selectedProducts);

      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }

    };



    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-slate-100 rounded-lg">
        <div className="flex items-center ml-6 mb-7 mt-4">
          <div className="h-10 w-1 bg-[#7924CE] mr-2 rounded"></div>
          <h2 className="text-lg sm:text-3xl font-extrabold text-[#7924CE]">
            Customer Favorites
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array(10)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm bg-white p-4"
              >
                <Skeleton height={150} className="mb-4 rounded-md" />
                <Skeleton height={20} width="80%" className="mb-2" />
                <Skeleton height={20} width="40%" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 rounded-lg">
      <div className="flex items-center ml-6 mb-7 mt-4">
        <div className="h-10 w-1 bg-[#7924CE] mr-2 rounded"></div>
        <h2 className="text-3xl font-extrabold text-[#7924CE]">
          Customer Favorites
        </h2>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1.5}
        navigation
        breakpoints={{
          640: { slidesPerView: 2.5, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 30 },
          1024: { slidesPerView: 5, spaceBetween: 30 },
        }}
        className="mySwiper"

      >

        {bestsellers.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to={`/product/${product._id}`}>
              <div className="group relative rounded-xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg  bg-white ">
                <div className="relative p-4">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-full h-40 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-3 bg-gray-600 text-white p-1 rounded-md text-xs">Best seller</div>
                  <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    <div className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 cursor-pointer shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addProductToWishList(product._id);

                      }}
                    >

                      <Heart className="text-purple-700 w-5 h-5 " />
                    </div>
                    <div className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 cursor-pointer shadow-md absolute sm:top-60 top-60"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addProductToCart(product._id);

                      }}
                    >
                      <ShoppingCart className="text-purple-700  w-5 h-5 " />
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 text-left h-28 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2">
                      {product.title}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="ml-1 text-gray-400">
                        ({product.ratingsQuantity || 0})
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="font-bold text-base text-gray-900">
                        {product.price} EGP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default BestSellers;
