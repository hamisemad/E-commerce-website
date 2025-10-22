import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishList } from "./Context/WishListContext";
import emptyWishList from "../assets/images/empty-wishlist.png";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "./Context/CartContext";
import { Helmet } from "react-helmet-async";



export default function WishList() {
    const { wishList, deleteWishListProduct, getWishListProducts } = useWishList();
    const [busyId, setBusyId] = useState(null);
    const { addProductToCart } = useCart();


    useEffect(() => {
        getWishListProducts();
    }, []);

    if (!wishList) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#6b46c1" size={80} />
            </div>
        );
    }

    if (wishList.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
                <img src={emptyWishList} alt="Empty wishlist" className="mx-auto w-72 mt-4" />
                <p className="text-gray-500 mt-2">
                    Browse products and add them to your wishlist.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-6 px-5 py-2 bg-purple-600 text-white rounded-full"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handleDelete = async (productId) => {
        try {
            setBusyId(productId);
            await deleteWishListProduct(productId);
            await getWishListProducts();
        } finally {
            setBusyId(null);
        }
    };

    return (
        <>
            <Helmet>
                <title>My Wishlist | SuperKart</title>
                <meta
                    name="description"
                    content="View and manage your saved products in your SuperKart wishlist."
                />
                <meta property="og:title" content="My Wishlist - SuperKart" />
                <meta
                    property="og:description"
                    content="Browse your saved items and add them to your cart from your wishlist."
                />
            </Helmet>
            <div className="min-h-screen py-10 px-5">
                <div className="max-w-7xl mx-auto px-4">

                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Wishlist</h1>
                    <p className="text-gray-500 mb-8">Save your favorite items</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishList.map((item) => (
                            <div
                                key={item._id}
                                className="relative border border-gray-200 rounded-lg overflow-hidden transition hover:border-purple-300 flex flex-col justify-between bg-white"
                            >
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    disabled={busyId === item._id}
                                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-50 transition z-10"
                                    aria-label="Remove from wishlist"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-500 hover:text-purple-600" />
                                </button>

                                <div className="bg-white relative pt-[100%]">
                                    <Link to={`/product/${item._id}`} className="absolute inset-0 flex items-center justify-center p-4">
                                        <img
                                            src={item.imageCover}
                                            alt={item.title}
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>
                                </div>

                                <div className="p-3 text-center flex flex-col justify-end flex-grow border-t border-gray-100">
                                    <Link to={`/product/${item._id}`}>
                                        <h2 className="font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-purple-600 transition-colors">
                                            {item.title}
                                        </h2>
                                    </Link>

                                    <p className="text-lg font-bold text-gray-700 mt-2 mb-3">
                                        EGP {item.price}
                                    </p>
                                    <div className="flex justify-center items-center">
                                        <button
                                            onClick={() => {
                                                addProductToCart(item._id);
                                            }}
                                            className="w-40 bg-purple-600 text-white rounded-full p-2 text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={16} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}