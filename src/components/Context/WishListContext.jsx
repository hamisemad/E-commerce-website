import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const WishListContext = createContext();
export const useWishList = () => useContext(WishListContext);

export default function WishListProvider({ children }) {
    const [wishList, setWishList] = useState([]);

    const getHeaders = () => ({
        token: localStorage.getItem("userToken"),
    });

    async function getWishListProducts() {
        if (!localStorage.getItem("userToken")) return;

        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: getHeaders(),
            });
            setWishList(data?.data || []);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
        }
    }

    async function addProductToWishList(productId) {
        try {
            await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId },
                { headers: getHeaders() }
            );
            toast.success("Product added to wishlist");
            getWishListProducts();
        } catch (err) {
            toast.error("you need to login first !");
        }
    }

    async function deleteWishListProduct(productId) {
        try {
            await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: getHeaders() }
            );
            toast.success("Product removed from wishlist");
            getWishListProducts();
        } catch (err) {
            toast.error("Failed to remove product");
        }
    }

    const WishListCount = wishList.length;

    useEffect(() => {
        getWishListProducts();
    }, []);

    return (
        <WishListContext.Provider
            value={{ wishList, addProductToWishList, deleteWishListProduct, getWishListProducts, WishListCount }}
        >
            {children}
        </WishListContext.Provider>
    );
}
