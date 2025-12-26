import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


const baseUrl = "https://ecommerce.routemisr.com/api/v1";

export default function PaymentSuccess() {
    const location = useLocation();

    // Order passed from checkout (cash)
    const [order, setOrder] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(true);

    /* ---------------- Fetch latest order (Stripe fallback) ---------------- */
    const fetchLatestOrder = async () => {
        const token = localStorage.getItem("userToken");

        if (!token) {
            toast.error("You need to login to see your order");
            setLoading(false);
            return;
        }

        try {
            //  MANUAL JWT DECODE 
            const base64Url = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(base64Url));
            const userId = decodedPayload.id;

            const { data } = await axios.get(
                `${baseUrl}/orders/user/${userId}`
            );

            if (!data?.length) {
                toast.error("No orders found");
                return;
            }

            // TAKE ONLY THE LATEST ORDER
            const latestOrder = data[data.length - 1];
            setOrder(latestOrder);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!order) {
            fetchLatestOrder(); // Stripe case
        } else {
            setLoading(false); // Cash case
        }
    }, []);

    const OrderSkeleton = () => {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse">
                <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>

                <div className="border p-6 rounded-lg shadow bg-white space-y-4">
                    <div className="flex justify-between">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded"></div>
                    </div>

                    <div className="h-4 w-40 bg-gray-200 rounded"></div>

                    <div className="space-y-3 mt-6">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    if (loading) {
        return <OrderSkeleton />;
    }

    if (!order) {
        return (
            <h2 className="text-center mt-10 text-red-500">
                Order not found
            </h2>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-purple-900">
                Order placed successfully!
            </h1>

            <div className="border p-6 rounded-lg shadow bg-white">
                <div className="flex justify-between items-center mb-4">
                    <p>
                        <strong>Order ID:</strong> #{order._id.slice(-6)}
                    </p>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded">
                        {order.paymentMethodType}
                    </span>
                </div>

                <p className="mb-4">
                    <strong>Total:</strong> {order.totalOrderPrice} EGP
                </p>

                <div>
                    <p className="font-semibold mb-2 text-gray-700">
                        Items:
                    </p>

                    {order.cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex gap-4 border-b py-3 last:border-b-0"
                        >
                            <img
                                src={item.product.imageCover}
                                alt={item.product.title}
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <p className="font-medium">
                                    {item.product.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Qty: {item.count}
                                </p>
                                <p className="text-purple-900 font-bold">
                                    {item.price} EGP
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
