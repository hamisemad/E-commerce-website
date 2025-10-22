import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import img from "../assets/images/register-img.jpg";
import { Mail, Lock, User } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";




export default function Register() {
    const { signUp, login } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);

    const inputClasses = "w-full border border-gray-400 rounded-lg p-3 pl-10 focus:outline-none focus:ring focus:ring-purple-400 transition";


    const signupSchema = Yup.object({
        name: Yup.string()
            .min(5, "Must be at least 5 characters")
            .max(30, "Name too long")
            .required("Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string()
            .matches(
                /^[A-Z][a-z0-9@]{5,}$/i,
                "Password must start with a capital letter and be at least 6 characters"
            )
            .required("Password is required"),
        rePassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: isLogin
            ? { email: "", password: "" }
            : { name: "", email: "", password: "", rePassword: "" },
        validationSchema: isLogin ? loginSchema : signupSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isLogin) {
                    await login(values);
                    navigate("/");

                } else {
                    await signUp(values);
                    toast.success("Account created successfully!");
                    setIsLogin(true);
                }
            } catch (err) {
                setSubmitting(false);
            } finally {
                setSubmitting(false);
            }
        },

    });

    return (
        <>

            <Helmet>
                <title>Register | SuperKart</title>
                <meta
                    name="description"
                    content="Create a new SuperKart account to shop the latest products and deals."
                />
                <meta property="og:title" content="Register - SuperKart" />
                <meta
                    property="og:description"
                    content="Join SuperKart today and enjoy a seamless shopping experience."
                />
            </Helmet>

            <div className="flex justify-center items-center w-full bg-gray-100 p-14">

                <div className="flex bg-white shadow-2xl rounded-xl overflow-hidden max-w-4xl w-full items-stretch">
                    <div className="">
                        <img
                            src={img}
                            className="w-[30em] h-full object-cover rounded-l-2xl hidden sm:block"
                            alt={isLogin}
                        />
                    </div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className="px-8 pt-6 pb-8 w-[30em] flex flex-col"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            {isLogin ? "Welcome back!" : "Let's get started"}
                        </h2>

                        {!isLogin && (
                            <div className="relative mb-4">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={inputClasses}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                                )}
                            </div>
                        )}

                        <div className="relative mb-4">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={inputClasses}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={inputClasses}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                )}
                            </div>

                            {isLogin && (
                                <div className="flex justify-end mt-1">
                                    <a
                                        href="#"
                                        className="text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toast('Forgot Password functionality TBD!');
                                        }}
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                            )}
                        </div>

                        {!isLogin && (
                            <div className="relative mb-6">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="rePassword"
                                    placeholder="Confirm Password"
                                    value={formik.values.rePassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={inputClasses}
                                />
                                {formik.touched.rePassword && formik.errors.rePassword && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.rePassword}</div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-center items-center">
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className=" sm:w-48 w-32 bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition disabled:opacity-60"
                            >
                                {formik.isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <ClipLoader color="#FAFAFA" size={20} />
                                    </div>
                                ) : (isLogin
                                    ? "Login"
                                    : "Sign Up")}
                            </button>
                        </div>

                        <p className="text-sm text-center mt-4">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <span
                                className="text-blue-600 cursor-pointer hover:underline font-semibold"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
