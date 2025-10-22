import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import illustration from "../assets/images/Wavy_Bus-17_Single-06.jpg";
import Visa from "../assets/icons/visa-svgrepo-com.svg";
import MasterCard from "../assets/icons/mastercard-svgrepo-com.svg";
import Paypal from "../assets/icons/paypal-icon-logo-svgrepo-com.svg";

function Footer() {


    return (
        <div className="bg-slate-100 p-9">
            <section className="bg-white py-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12
             rounded-3xl shadow-lg shadow-purple-300">
                <div className="max-w-md mb-6 md:mb-0">
                    <h2 className="text-2xl sm:text-5xl md:text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
                        Subscribe to our Newsletter
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                        Get the latest deals, updates, and exclusive offers directly to your inbox.
                    </p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full md:w-64 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none "
                        />
                        <button className="px-3 py-1 sm:py-3 sm:px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-r-lg hover:opacity-90 transition -translate-x-2">
                            Subscribe
                        </button>
                    </div>
                </div>

                <div>
                    <img
                        src={illustration}
                        alt="newsletter illustration"
                        className="w-full h-auto max-w-[16em] sm:max-w-[24em] md:max-w-[28em] lg:max-w-[32em]"
                    />
                </div>
            </section>

            <footer className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white mt-12 py-12 px-6 rounded-t-3xl">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 sm:gap-x-12 md:gap-x-16 lg:gap-x-24">

                    <div className="space-y-4">
                        <h3 className="text-3xl font-extrabold whitespace-nowrap text-white tracking-wider mb-4">Super<span className='text-yellow-300'>Kart</span></h3>
                        <h4 className="font-semibold text-lg text-white">Get to Know Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">About SuperKart</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Careers</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">SuperKart Science</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg text-white mb-4">Shop with Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Your Account</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Your Orders</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Your Addresses</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Your Lists</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg text-white mb-4">Make Money with Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Protect and build your brand</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Advertise Your Products</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Sell on SuperKart</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Fulfillment by SuperKart</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Supply to SuperKart</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg text-white mb-4">Let Us Help You</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Help</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Shipping & Delivery</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Returns & Replacements</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">Recalls and Product Safety Alerts</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-200 transition">SuperKart App Download</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-400/30 mt-10 pt-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-white text-sm">

                        <div className="flex space-x-5 mb-4 md:mb-0">
                            <a href="#" aria-label="Facebook" className="text-white hover:text-gray-200 transition">
                                <Facebook size={22} />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-white hover:text-gray-200 transition">
                                <Twitter size={22} />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-white hover:text-gray-200 transition">
                                <Instagram size={22} />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-white hover:text-gray-200 transition">
                                <Linkedin size={22} />
                            </a>
                        </div>

                        <div className="flex space-x-4 mb-4 md:mb-0">
                            <img src={Visa} alt="Visa" className="h-8" title='Visa' />
                            <img src={MasterCard} alt="MasterCard" className="h-8" title='MasterCard' />
                            <img src={Paypal} alt="PayPal" className="h-8" title='PayPal' />
                        </div>

                        <p>© 2025 SuperKart. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer;