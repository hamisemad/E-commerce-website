import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "./Context/CartContext";
import { useWishList } from "./Context/WishListContext";



export default function YouMayLikeSlider({ categoryId, currentProductId }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addProductToCart } = useCart();
    const { addProductToWishList } = useWishList();


    useEffect(() => {
        if (categoryId) {
            const fetchRelatedProducts = async () => {
                try {
                    const response = await axios.get(
                        `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`
                    );

                    const filteredProducts = response.data.data
                        .filter(product => product._id !== currentProductId)
                        .slice(0, 10);

                    setRelatedProducts(filteredProducts);
                } catch (err) {
                    console.error("Error fetching related products:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchRelatedProducts();
        }
    }, [categoryId, currentProductId]);

    if (loading || relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className=" rounded-lg">
            <div className="flex items-center ml-6 mb-7 mt-4">
                <div className="h-10 w-1 bg-[#7924CE] mr-2 rounded"></div>
                <h2 className="sm:text-3xl text-2xl font-extrabold text-gray-800">
                    You May Like
                </h2>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={30}
                slidesPerView={1.2}
                navigation
                breakpoints={{
                    640: { slidesPerView: 2.5, spaceBetween: 20 },
                    768: { slidesPerView: 4, spaceBetween: 30 },
                    1024: { slidesPerView: 5, spaceBetween: 30 },
                }}
                className="mySwiper"

            >
                {relatedProducts.map((product) => (
                    <SwiperSlide key={product._id}>
                        <Link to={`/product/${product._id}`}>
                            <div className="group relative rounded-xl overflow-hidden transition-shadow duration-300 shadow-lg  bg-white ">
                                <div className="relative p-4">
                                    <img
                                        src={product.imageCover}
                                        alt={product.title}
                                        className="w-full h-40 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
                                    />
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
                                        <div className="bg-gray-50 hover:bg-slate-200 rounded-full p-2 cursor-pointer shadow-md absolute sm:top-60 top-32"
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