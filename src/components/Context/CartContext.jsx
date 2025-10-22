import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export default function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [isCartSideBarOpen, setIsCartSideBarOpen] = useState(false);

    const baseUrl = "https://ecommerce.routemisr.com/api/v1";

    const getHeaders = () => ({
        token: localStorage.getItem("userToken"),
    });

    const getEmptyCartState = () => ({
        data: {
            products: [],
            totalCartPrice: 0,
            _id: null,
        },
        numOfCartItems: 0,
    });

    const OpenCartSideBar = () => setIsCartSideBarOpen(true);
    const CloseCartSideBar = () => setIsCartSideBarOpen(false);


    async function addProductToCart(productId) {
        try {
            const { data } = await axios.post(
                `${baseUrl}/cart`,
                { productId },
                { headers: getHeaders() }
            );
            await getProductsCart();

            toast.success(data?.message || "Product added to cart");
            OpenCartSideBar();

        } catch (err) {
            console.error("Error adding product:", err);
            if (err.response && err.response.status === 401) {
                setCart(null);
                toast.error("You need to login first");
            } else {
                toast.error("Failed to add product");
            }
        }
    }

    async function getProductsCart() {
        const token = localStorage.getItem("userToken");
        if (!token) {
            setCart(getEmptyCartState());
            return;
        }

        try {
            const { data } = await axios.get(`${baseUrl}/cart`, { headers: getHeaders() });
            setCart(data);
        } catch (err) {
            console.error("Error fetching cart:", err);
            if (err.response && err.response.status === 404) {
                setCart(getEmptyCartState());
            } else if (err.response && err.response.status === 401) {
                setCart(getEmptyCartState());
            }
        }
    }

    async function updateCartProduct(productId, count) {
        try {
            if (count === 0) {
                await deleteCartProduct(productId);
                return;
            }

            const { data } = await axios.put(
                `${baseUrl}/cart/${productId}`,
                { count },
                { headers: getHeaders() }
            );
            setCart(data);
        } catch (err) {
            console.error("Error updating cart:", err);
            toast.error("Failed to update item");
        }
    }

    async function deleteCartProduct(productId) {
        try {
            const { data } = await axios.delete(
                `${baseUrl}/cart/${productId}`,
                { headers: getHeaders() }
            );

            if (data?.numOfCartItems === 0) {
                setCart(getEmptyCartState());
                toast.success("Last product removed. Cart is empty.");
            } else {
                setCart(data);
                toast.success("Product removed from cart");
            }

        } catch (err) {
            console.error("Error deleting product:", err);
            toast.error("Failed to remove product");
        }
    }


    async function clearCart() {
        try {
            await axios.delete(
                `${baseUrl}/cart`,
                { headers: getHeaders() }
            );
            setCart(getEmptyCartState());
            toast.success("Cart cleared successfully");
        } catch (err) {
            console.error("Error clearing cart:", err);
            toast.error("Failed to clear cart");
        }
    }

    const items = cart?.data?.products || [];
    const cartCount = items.length;


    useEffect(() => {
        getProductsCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                addProductToCart,
                getProductsCart,
                updateCartProduct,
                deleteCartProduct,
                clearCart,
                cartCount,
                isCartSideBarOpen,
                OpenCartSideBar,
                CloseCartSideBar,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}