import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function resetPassword() {
    const { resetPassword, loading } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            newPassword: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email required"),
            newPassword: Yup.string()
                .matches(
                    /^[A-Z][a-z0-9@]{5,}$/i,
                    "Password must start with a capital letter & be at least 6 characters"
                )
                .required("New password required"),
        }),
        onSubmit: async (values) => {
            try {
                await resetPassword(values);
                navigate("/");
            } catch {
            }
        },
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Reset Password
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-3 rounded-lg mb-2"
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mb-2">{formik.errors.email}</p>
                )}

                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-3 rounded-lg mb-2"
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500 text-sm mb-2">
                        {formik.errors.newPassword}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
