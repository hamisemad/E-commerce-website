import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function verifyResetCode() {
    const { verifyResetCode, loading } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            resetCode: "",

        },
        validationSchema: Yup.object({
            resetCode: Yup.string()
                .length(6, "Code must be 6 digits")
                .required("Reset code is required"),

        }),
        onSubmit: async (values) => {
            try {
                await verifyResetCode(values.resetCode);
                navigate("/resetPassword");

            } catch {

            }
        }



    })

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Verify Reset Code
                </h2>

                <input
                    type="text"
                    name="resetCode"
                    placeholder="Enter 6-digit code"
                    value={formik.values.resetCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-3 rounded-lg mb-2 text-center tracking-widest"
                />

                {formik.touched.resetCode && formik.errors.resetCode && (
                    <p className="text-red-500 text-sm mb-2">
                        {formik.errors.resetCode}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
                >
                    {loading ? "Verifying..." : "Verify Code"}
                </button>
            </form>
        </div>
    );

}