import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import toast from "react-hot-toast";
import { useRef } from "react";


export default function ProtectedRoute({ children }) {
    const { token } = useAuth();
    const shownToast = useRef(false);

    if (!token) {
        if (!shownToast.current) {
            toast.error("You must be logged in to access this page");
            shownToast.current = true;
        }

        return <Navigate to="/register" replace />;

    }

    return children;
};