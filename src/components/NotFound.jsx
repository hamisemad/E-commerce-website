import React from 'react'
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animation from "../assets/Animations/404 website error animation.json";
import { Helmet } from "react-helmet-async";



function NotFound() {
    return (
        <>

            <Helmet>
                <title>Page Not Found | SuperKart</title>
                <meta
                    name="description"
                    content="The page you are looking for does not exist. Return to SuperKart and continue shopping."
                />
                <meta property="og:title" content="404 Page Not Found - SuperKart" />
                <meta
                    property="og:description"
                    content="Oops! It seems the page you’re trying to visit doesn’t exist."
                />
            </Helmet>


            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg text-gray-600 mb-6">Oops! Page or product not found.</p>

                <Link
                    to="/"

                >
                    <div className='flex justify-center items-center'>
                        <button className='bg-purple-500 rounded-full p-2 text-white'>   Go Home
                        </button>
                    </div>
                    <div className="w-full bg-inherit">
                        <Lottie animationData={animation} loop autoplay />
                    </div>


                </Link>

            </div>
        </>


    )
}

export default NotFound;