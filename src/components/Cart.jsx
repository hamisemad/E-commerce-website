import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./Context/CartContext";
import emptyCart from "../assets/images/cart img.png";
import { Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";



export default function Cart() {
    const {
        cart,
        getProductsCart,
        updateCartProduct,
        deleteCartProduct,
        clearCart,
    } = useCart();

    const [updateId, setUpdateId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const navigate = useNavigate();

    const shippingFee = 50;

    useEffect(() => {
        getProductsCart();
    }, []);

    if (!cart) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#6b46c1" size={80} />
            </div>
        );
    }
    const items = cart?.data?.products || [];
    const subtotal = cart?.data?.totalCartPrice || 0;
    const total = subtotal + shippingFee;

    if (!items.length) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <img src={emptyCart} alt="Empty cart" className="mx-auto w-72" />
                <p className="text-gray-500 mt-2">
                    Browse products and add them to your cart.
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

    const handleUpdate = (id, count) => {
        if (count < 1) return;
        setUpdateId(id);
        updateCartProduct(id, count).finally(() => setUpdateId(null));
    };

    const handleDelete = async (productId) => {
        try {
            setDeletingId(productId);
            await deleteCartProduct(productId);
        } finally {
            setBusyId(null);
        }
    };

    const handleClear = async () => {
        try {
            setClearing(true);
            await clearCart();
        } finally {
            setClearing(false);
        }
    };

    const handleCheckout = () => {
        setCheckoutLoading(true);
        setTimeout(() => navigate("/checkout"), 300);
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };


    return (

        <>
            <Helmet>
                <title>Shopping Cart | SuperKart</title>
                <meta
                    name="description"
                    content={` Review your products and proceed to checkout.`}
                />
            </Helmet>
            <div className="bg-slate-100 min-h-screen">
                <div className="max-w-7xl mx-auto p-4">
                    <h1 className="sm:text-3xl text-xl font-bold mb-6 mt-4">
                        Cart ({items.length} items)
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow p-4 py-9 border"
                                >
                                    <div className="flex items-center gap-4 cursor-pointer"
                                        onClick={() => handleProductClick(item.product._id)}>
                                        <img
                                            src={item.product.imageCover}
                                            alt={item.product.title}
                                            className="w-24 h-24 object-contain rounded-lg"
                                        />
                                        <div>
                                            <h2 className="font-semibold text-gray-900 line-clamp-2">
                                                {item.product.title}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Sold by:{" "}
                                                <span className="font-medium text-gray-700">Seller</span>
                                            </p>
                                            <p className="text-lg font-semibold text-gray-800 mt-3">
                                                EGP {item.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                                        <div className="flex items-center rounded-full px-5 py-2 border">
                                            <h3 className="text-gray-800 text-sm mr-3"> Qty </h3>

                                            <button
                                                onClick={() =>
                                                    handleUpdate(item.product._id, item.count - 1)
                                                }
                                                disabled={item.count <= 1 || updateId === item.product._id}
                                                className="w-3 font-bold disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2 font-medium">{item.count}</span>
                                            <button
                                                onClick={() =>
                                                    handleUpdate(item.product._id, item.count + 1)
                                                }
                                                disabled={updateId === item.product._id}
                                                className="w-3 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(item.product._id)}
                                            disabled={deletingId === item.product._id}
                                        >
                                            {deletingId === item.product._id ? (
                                                <ClipLoader color="#f56565" size={16} />
                                            ) : (
                                                <Trash2 />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleClear}
                                    disabled={clearing}
                                    className="w-48 py-3 bg-white border-purple-400 text-purple-400 hover:scale-110 transition rounded-full disabled:opacity-60 "
                                >
                                    {clearing ? <ClipLoader color="#9f7aea" size={20} /> : "Clear Cart"}
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-[30em]">
                            <div className="bg-white rounded-xl shadow p-5 border">
                                <h2 className="text-lg font-semibold mb-4 border-b-2">
                                    Order Summary
                                </h2>

                                <div className="flex justify-between text-gray-700 mb-2">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span>EGP {subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-gray-700 mb-4">
                                    <span>Shipping Fee</span>
                                    <span className="text-green-600 font-medium">
                                        EGP {shippingFee}
                                    </span>
                                </div>

                                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>
                                        EGP{" "}
                                        {total.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <Link
                                        to="/checkout"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCheckout();
                                        }}  >
                                        <button
                                            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                                            disabled={checkoutLoading}
                                        >
                                            {checkoutLoading ? <ClipLoader color="#fff" size={20} /> : "Checkout"}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}