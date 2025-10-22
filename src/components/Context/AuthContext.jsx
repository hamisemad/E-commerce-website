import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://ecommerce.routemisr.com/api/v1";

const AuthContext = createContext({
    user: null,
    token: null,
    loading: false,
    signUp: () => Promise.reject("AuthContext not initialized"),
    login: () => Promise.reject("AuthContext not initialized"),
    logout: () => { },
    verifyToken: () => { },
});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("userToken") || null);


    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;

        } else {
            delete axios.defaults.headers.common["token"];

        }
    }, [token]);

    const signUp = async (userData) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}/auth/signup`, userData);
            toast.success("Signup successful!");
            return data;

        } catch (err) {
            console.error("Signup error:", err);
            toast.error(err.response?.data?.message || "signup failed")
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}/auth/signin`, credentials);
            const userToken = data?.token;
            if (userToken) {
                setToken(userToken);
                localStorage.setItem("userToken", userToken);
                toast.success("Login successful!");

                const decodedUser = data?.user || data?.decoded;
                if (decodedUser) setUser(decodedUser);
            }
            return data;
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || "Login failed")
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("userToken");
        toast("Logged out");
    }


    const verifyToken = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;
        try {
            const { data } = await axios.get(`${API_URL}/auth/verifyToken`, {
                headers: { token },
            });
            setUser(data?.decoded || null);
            console.log("Verified user:", data.decoded);
        } catch (err) {
            console.error("Token verification failed:", err);
            logout();
        }
    };

    useEffect(() => {
        if (token) verifyToken();

    }, [token]);




    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                signUp,
                login,
                logout,
                verifyToken,
            }}

        >
            {children}

        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
