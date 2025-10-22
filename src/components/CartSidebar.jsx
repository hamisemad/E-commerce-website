import React from 'react';
import { useCart } from './Context/CartContext';
import { X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CartSidebar() {
    const { isCartSideBarOpen, CloseCartSideBar, cart, cartCount } = useCart();
    const items = cart?.data?.products || [];
    const navigate = useNavigate();
    return (
        <>
            {isCartSideBarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={CloseCartSideBar}
                />
            )}
            <div
                className={`fixed top-0 right-0 sm:w-full w-56 md:w-96 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
                    ${isCartSideBarOpen ? 'translate-x-0' : 'translate-x-full'}`
                } >

                <div className="p-6 h-full flex flex-col">

                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <ShoppingCart className="mr-2 h-6 w-6 text-indigo-600" />
                            Your Cart ({cartCount})
                        </h2>
                        <button
                            onClick={CloseCartSideBar}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    <div className='flex-grow py-4 space-y-4'>
                        {cartCount === 0 ? (
                            <p className="text-gray-500 text-center mt-10">Your cart is empty. Start shopping!</p>
                        ) : (
                            items.slice(0, 3).map((item, index) =>

                                <div key={index} className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg">
                                    <img src={item.product?.imageCover} alt={item.product?.title} className="w-12 h-12 object-cover rounded" />
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold text-sm truncate">{item.product?.title}</p>
                                        <p className="text-xs text-gray-600">Qty: {item.count} | ${item.price}</p>
                                    </div>

                                </div>
                            ))
                        }
                        {cartCount > 3 && (
                            <p className="text-sm text-indigo-600 text-center">... and {cartCount - 3} more items</p>
                        )}
                    </div>

                    <div className='mt-auto pt-4 border-t space-y-3'>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Subtotal:</span>
                            <span>${cart?.data?.totalCartPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        <button
                            onClick={() => {
                                navigate("/cart");
                                CloseCartSideBar();
                            }}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Go to Cart
                        </button>
                        <button
                            onClick={CloseCartSideBar}
                            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            Continue Shopping
                        </button>

                    </div>
                </div>

            </div>

        </>

    );
}

export default CartSidebar;