import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCart } from "../Context/CartContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const baseUrl = "https://ecommerce.routemisr.com/api/v1";
const shippingFee = 50;

const getHeaders = () => ({
    token: localStorage.getItem("userToken"),
});

export const useCheckOutLogic = () => {
    const { cart, getProductsCart, clearCart } = useCart();
    const navigate = useNavigate();

    /* -------------------- Address State -------------------- */
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);

    /* -------------------- Order State -------------------- */
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [isOrderLoading, setIsOrderLoading] = useState(false);

    /* -------------------- Totals -------------------- */
    const subtotal = cart?.data?.totalCartPrice || 0;
    const total = subtotal + shippingFee;

    const fetchUserAddresses = useCallback(async () => {
        setAddressLoading(true);
        try {
            const { data } = await axios.get(
                `${baseUrl}/addresses`,
                { headers: getHeaders() }
            );
            setAddresses(data.data || []);
            if (data.data?.length) {
                setSelectedAddress(data.data[0]._id);
            }
        } catch {
            toast.error("Failed to load addresses");
        } finally {
            setAddressLoading(false);
        }
    }, []);

    const saveNewAddress = async (values, resetForm) => {
        try {
            setAddressLoading(true);
            await axios.post(
                `${baseUrl}/addresses`,
                values,
                { headers: getHeaders() }
            );
            toast.success("Address added");
            resetForm();
            fetchUserAddresses();
        } catch {
            toast.error("Failed to save address");
        } finally {
            setAddressLoading(false);
        }
    };

    const removeAddress = async (id) => {
        try {
            setAddressLoading(true);
            await axios.delete(
                `${baseUrl}/addresses/${id}`,
                { headers: getHeaders() }
            );
            toast.success("Address removed");
            fetchUserAddresses();
            if (selectedAddress === id) setSelectedAddress(null);
        } catch {
            toast.error("Failed to remove address");
        } finally {
            setAddressLoading(false);
        }
    };

    const processOrder = async (shippingAddress) => {
        if (!cart?.data?._id) {
            toast.error("Cart is empty");
            return;
        }

        try {
            setIsOrderLoading(true);

            /* ---------- CASH ORDER ---------- */
            if (paymentMethod === "cash") {
                await axios.post(
                    `${baseUrl}/orders/${cart.data._id}`,
                    { shippingAddress },
                    { headers: getHeaders() }
                );

                toast.success("Order placed successfully");
                clearCart(false);

                //  ALWAYS navigate after cash order
                navigate("/paymentSuccess", { replace: true });
                return;
            }

            /* ---------- STRIPE ORDER ---------- */
            const successUrl = `${window.location.origin}/paymentSuccess`;

            const { data } = await axios.post(
                `${baseUrl}/orders/checkout-session/${cart.data._id}?url=${encodeURIComponent(
                    successUrl
                )}`,
                { shippingAddress },
                { headers: getHeaders() }
            );

            if (!data?.session?.url) {
                toast.error("Stripe session failed");
                return;
            }

            window.location.href = data.session.url;
        } catch (err) {
            toast.error("Failed to place order");
            console.error(err);
        } finally {
            setIsOrderLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            city: "",
            details: "",
            phone: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            details: Yup.string().required("Required"),
            phone: Yup.string()
                .matches(/^01[0-9]{9}$/, "Invalid phone number")
                .required("Required"),
        }),
        onSubmit: (values, { resetForm }) =>
            saveNewAddress(values, resetForm),
    });

    /* -------------------- Complete Order Button -------------------- */
    const handleOrderSubmission = () => {
        if (!selectedAddress) {
            toast.error("Select a delivery address");
            return;
        }

        const address = addresses.find(
            (addr) => addr._id === selectedAddress
        );

        if (!address) {
            toast.error("Address not found");
            return;
        }

        processOrder({
            city: address.city,
            details: address.details,
            phone: address.phone,
        });
    };

    useEffect(() => {
        getProductsCart();
        fetchUserAddresses();
    }, [fetchUserAddresses, getProductsCart]);

    /* -------------------- Exposed API -------------------- */
    return {
        cart,
        addresses,
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        selectedAddress,
        isOrderLoading,
        addressLoading,
        formik,
        setPaymentMethod,
        setSelectedAddress,
        removeAddress,
        handleOrderSubmission,
    };
};
