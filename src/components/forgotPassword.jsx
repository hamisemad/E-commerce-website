import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        await forgotPassword(values.email);
        navigate("/verifyResetCode");
      } catch {}
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Forgot your password?
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email and we’ll send you a reset code.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 transition
                ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-purple-200"
                }`}
            />
          </div>

          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium
                     hover:bg-purple-700 transition
                     disabled:opacity-60 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Sending reset code..." : "Send reset code"}
        </button>
      </form>
    </div>
  );
}
