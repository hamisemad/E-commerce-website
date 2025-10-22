import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCart } from "../Context/CartContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


const baseUrl = "https://ecommerce.routemisr.com/api/v1";
const shippingFee = 50;
const getHeaders = () => ({ token: localStorage.getItem("userToken") });

const safeApiRequest = async (url, method, data = {}) => {
    try {
        const config = { headers: getHeaders() };
        let response;
        if (method === "post") response = await axios.post(url, data, config);
        else if (method === "delete") response = await axios.delete(url, config);
        else if (method === "get") response = await axios.get(url, config);
        return response.data;
    } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        console.error(`${method.toUpperCase()} API Error:`, errorMsg);
        throw new Error(errorMsg);
    }
};

export const useCheckOutLogic = () => {
    const { cart } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [isOrderLoading, setIsOrderLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [singleProduct, setSingleProduct] = useState(null);
    const [singleProductLoading, setSingleProductLoading] = useState(false);

    const location = useLocation();
    const productId = location.state?.productId;

    // --- Price Calculation Logic ---
    const subtotal = productId
        ? singleProduct?.price || 0
        : cart?.data?.totalCartPrice || 0;
    const total = subtotal + shippingFee;

    // --- API Functions (Rest of the functions are correct) ---
    const fetchUserAddresses = useCallback(async () => {
        try {
            const data = await safeApiRequest(`${baseUrl}/addresses`, "get");
            setAddresses(data.data);
            if (data.data.length && !selectedAddress) {
                setSelectedAddress(data.data[0]._id);
            }
        } catch {
            toast.error("Failed to load addresses");
        }
    }, [selectedAddress]);

    const fetchSingleProduct = useCallback(async () => {
        setSingleProductLoading(true);
        try {
            const res = await axios.get(`${baseUrl}/products/${productId}`);
            setSingleProduct(res.data.data);
        } catch (err) {
            console.error("Failed to load product for Buy Now:", err);
            toast.error("Failed to load product for Buy Now.");
        } finally {
            setSingleProductLoading(false);
        }
    }, [productId]);

    const saveNewAddress = async (values, resetForm) => {
        try {
            setAddressLoading(true);
            await safeApiRequest(`${baseUrl}/addresses`, "post", values);
            toast.success("Address added successfully");
            await fetchUserAddresses();
            resetForm();
        } catch {
            toast.error("Failed to save address");
        } finally {
            setAddressLoading(false);
        }
    };

    const removeAddress = async (id) => {
        try {
            setAddressLoading(true);
            await safeApiRequest(`${baseUrl}/addresses/${id}`, "delete");
            toast.success("Address removed successfully");
            await fetchUserAddresses();
            if (selectedAddress === id) setSelectedAddress(null);
        } catch {
            toast.error("Failed to remove address");
        } finally {
            setAddressLoading(false);
        }
    };

    const processPaymentAndOrder = async (shippingInfo, isCash) => {
        const isBuyNow = !!productId;
        const cartId = cart?.data?._id;

        if (!isBuyNow && !cartId)
            return toast.error("Cart ID missing. Please reload the cart.");
        if (isBuyNow && !singleProduct)
            return toast.error("Product details not loaded. Cannot proceed with Buy Now.");

        try {
            setIsOrderLoading(true);
            const payload = { shippingAddress: shippingInfo };
            let url;

            if (isBuyNow) {
                payload.productId = productId;
                url = isCash
                    ? `${baseUrl}/orders`
                    : `${baseUrl}/orders/checkout-session?url=http://localhost:3000`;
            } else {
                url = isCash
                    ? `${baseUrl}/orders/${cartId}`
                    : `${baseUrl}/orders/checkout-session/${cartId}?url=http://localhost:3000`;
            }

            const { data } = await axios.post(url, payload, { headers: getHeaders() });

            if (!isCash && (data.session?.url || data.url)) {
                window.location.href = data.session?.url || data.url;
            } else {
                toast.success("Order placed successfully!");
            }
        } catch (err) {
            const errorDetails = err.response?.data || err.message;
            console.error("Order Processing Error:", errorDetails);
            toast.error("Order failed. Please check your details.");
        } finally {
            setIsOrderLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: { name: "", details: "", city: "", phone: "" },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            details: Yup.string().required("Address details required"),
            city: Yup.string().required("City is required"),
            phone: Yup.string()
                .matches(/^01[0-9]{9}$/, "Enter valid phone number (11 digits)")
                .required("Phone number is required"),
        }),
        onSubmit: (values, { resetForm }) => saveNewAddress(values, resetForm),
    });

    const handleOrderSubmission = () => {
        if (!productId && !cart?.data?.products?.length)
            return toast.error("Your cart is empty.");

        let shippingInfo = {};
        if (selectedAddress) {
            const addressData = addresses.find((addr) => addr._id === selectedAddress);
            if (!addressData) return toast.error("Selected address not found.");
            shippingInfo = {
                city: addressData.city,
                phone: addressData.phone,
                details: addressData.details,
            };
        } else {
            formik.validateForm();
            const { name, city, details, phone } = formik.values;
            const errors = formik.errors;
            const isValid = name && city && details && phone && Object.keys(errors).length === 0;

            if (!isValid)
                return toast.error("Please fill in all shipping fields correctly.");

            shippingInfo = { city, phone, details };
        }
        processPaymentAndOrder(shippingInfo, paymentMethod === "cash");
    };

    useEffect(() => {
        fetchUserAddresses();
        if (productId) {
            fetchSingleProduct();
        }
    }, [productId, fetchUserAddresses, fetchSingleProduct]);

    useEffect(() => {
        if (productId) {
            localStorage.setItem("buyNowProductId", productId);
        } else {
            localStorage.removeItem("buyNowProductId");
        }
    }, [productId]);

    return {
        cart,
        addresses,
        singleProduct,
        productId,
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        selectedAddress,
        isOrderLoading,
        addressLoading,
        singleProductLoading,
        formik,
        setPaymentMethod,
        setSelectedAddress,
        removeAddress,
        handleOrderSubmission,
    };
};