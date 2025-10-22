import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from "react-router-dom";
import Banner from "../assets/images/banner 3.png";
import New from "../assets/icons/new-star-svgrepo-com (1).svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useWishList } from "./Context/WishListContext";
import { useCart } from "./Context/CartContext";



function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addProductToCart } = useCart();
  const { addProductToWishList } = useWishList();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/products"
        );

        const allProducts = response.data.data;
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 15);
        setNewArrivals(randomProducts);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-slate-100 rounded-lg">

        <div className="flex items-center justify-center mb-7 mt-4 ">
          <div className="w-fit aspect-[15/5]">
            <img src={Banner} alt="Banner" className="w-full h-full object-fill rounded-xl" />
          </div>
        </div>
        <div className="flex mb-11 ml-6 mt-6">
          <div className="h-7 sm:h-10 w-1 bg-[#7924CE] mr-2 rounded"></div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#7924CE]">
            Fresh finds, Just for you
          </h2>
        </div>

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
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-8 bg-slate-100 rounded-lg">

      <div className="flex items-center justify-center mb-7 mt-4 ">
        <div className="w-fit aspect-[15/5]">
          <img src={Banner} alt="Banner" className="w-full h-full object-fill rounded-xl" />
        </div>
      </div>
      <div className="flex mb-11 ml-6 mt-6">
        <div className="h-7 sm:h-10 w-1 bg-[#7924CE] mr-2 rounded"></div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#7924CE]">
          Fresh finds, Just for you
        </h2>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-10 cursor-pointer">
        {newArrivals.map((product) => (
          <Link to={`/product/${product._id}`}
            key={product.id}
            className="relative border bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 "
          >
            <div className="relative w-full aspect-w-1 aspect-h-1">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-contain"
              />

              <div className="absolute top-0 -left-4">
                <img src={New} alt="New" className="w-10" />
              </div>

              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <div className="bg-gray-100 rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addProductToWishList(product._id);


                  }}
                >
                  <Heart size={20} className="text-purple-700" />
                </div>
                <div
                  className="bg-gray-100 rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-200 
                 absolute top-40 sm:top-56 md:top-52 lg:top-56 "
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addProductToCart(product._id);
                  }}
                >
                  <ShoppingCart size={20} className="text-purple-700" />
                </div>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-5 truncate">
                {product.title}
              </h3>
              <span className="text-sm md:text-base font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NewArrivals;