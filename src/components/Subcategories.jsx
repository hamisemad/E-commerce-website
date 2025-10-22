import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Lottie from "lottie-react";
import animation from "../assets/Animations/coming soon.json";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Helmet } from "react-helmet-async";

import bannerWoman from "../assets/images/woman's banner.jpg";
import bannerMan from "../assets/images/men's banner.jpg";
import bannerElectronics from "../assets/images/electronics banner.png";

const ROUTE_MISR_API = "https://ecommerce.routemisr.com/api/v1";

const categoryBanners = {
    "Women's Fashion": bannerWoman,
    "Men's Fashion": bannerMan,
    "Electronics": bannerElectronics,
};

function Breadcrumbs({ categoryName }) {
    return (
        <nav className="text-sm mb-6 text-gray-600">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>/</li>
                <li>
                    <span className="font-semibold">{categoryName}</span>
                </li>
            </ol>
        </nav>
    );
}

function ProductCard({ product }) {
    const image = product.imageCover || "https://via.placeholder.com/300";
    const rawRating = product.ratingsAverage ?? 0;
    const ratingRounded = Math.max(0, Math.min(5, Math.round(Number(rawRating) || 0)));
    const ratingCount = product.ratingsQuantity ?? 0;

    return (
        <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300">
            <div className="overflow-hidden rounded-t-lg">
                <img
                    src={image}
                    alt={product.title}
                    className="w-full h-48 object-contain transform hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <h3 className="text-sm font-semibold mb-1 truncate text-gray-800">{product.title}</h3>
                <p className="text-gray-900 font-bold text-lg mb-2">
                    {product.price !== undefined && product.price !== null ? `EGP ${product.price}` : "—"}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < ratingRounded ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                    ))}
                    <span className="ml-1 text-gray-400">({ratingCount})</span>
                </div>
            </div>
            <div
                className="absolute top-1 right-3 cursor-pointer bg-slate-200 p-2 rounded-full shadow-md hover:bg-slate-100 transition"
                aria-label="Add to wishlist"
            >
                <Heart className="w-5 h-5 text-purple-700" />
            </div>
            <div
                className="absolute sm:bottom-3 bottom-28 md:bottom-9 lg:bottom-3 right-3 bg-slate-200 p-2 rounded-full shadow-md hover:bg-slate-100 transition cursor-pointer"
                aria-label="Add to cart"
            >
                <ShoppingCart className="w-5 h-5 text-purple-700" />
            </div>
        </div>
    );
}

export default function Subcategories() {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryHasBanner = category && categoryBanners[category.name];
    const showSkeletonBanner = loading && categoryHasBanner;

    useEffect(() => {
        if (!categoryId) return;
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const catRes = await axios.get(`${ROUTE_MISR_API}/categories/${categoryId}`);
                if (!mounted) return;
                const catData = catRes.data.data;
                setCategory(catData);

                try {
                    const subsRes = await axios.get(`${ROUTE_MISR_API}/categories/${categoryId}/subcategories`);
                    setSubcategories(subsRes.data.data || []);
                } catch {
                    setSubcategories([]);
                }

                let finalProducts = [];
                const isCurrentCategoryComingSoon = !categoryBanners[catData.name];

                if (!isCurrentCategoryComingSoon) {
                    try {
                        const prodRes = await axios.get(`${ROUTE_MISR_API}/products?category=${categoryId}&limit=100`);
                        finalProducts = (prodRes.data.data || []).map((p) => ({ ...p, source: "routemisr" }));
                    } catch (prodErr) {
                        console.warn("Product fetch failed:", prodErr.message);
                    }
                }

                setProducts(finalProducts);
            } catch (err) {
                console.error("Error fetching category:", err);
                setError("Could not load category details.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [categoryId]);

    useEffect(() => {
        if (category?.name) {
            document.title = `${category.name} | SuperKart`;
        } else {
            document.title = "SuperKart";
        }
    }, [category]);

    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    const isComingSoonCategory = !categoryHasBanner || (!loading && products.length === 0);

    if (isComingSoonCategory) {
        return (
            <>
                <Helmet>
                    <title>{category?.name ? `${category.name} | SuperKart` : "SuperKart"}</title>
                    <meta
                        name="description"
                        content={
                            category?.name
                                ? `Shop the best ${category.name} products at SuperKart.`
                                : "Shop the best deals at SuperKart."
                        }
                    />
                </Helmet>

                <section className="p-6 max-w-7xl mx-auto">
                    <Breadcrumbs categoryName={category?.name || "Category"} />
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-full max-w-lg mx-auto">
                            <Lottie animationData={animation} loop autoplay />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            {category?.name} – Coming Soon!
                        </h2>
                        <p className="text-gray-500 text-center">
                            We’re working on adding products to this category. Stay tuned!
                        </p>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Helmet key={category?._id || "default"}>
                <title>
                    {category?.name ? `${category.name} | SuperKart` : "SuperKart"}
                </title>
                <meta
                    name="description"
                    content={
                        category?.name
                            ? `Shop the best deals on ${category.name} at SuperKart.`
                            : "Welcome to SuperKart — your favorite online store."
                    }
                />
            </Helmet>


            <section className="p-6 max-w-7xl mx-auto">
                <Breadcrumbs categoryName={category?.name || "Category"} />

                <div className="mb-16 relative">
                    {showSkeletonBanner ? (
                        <Skeleton height={350} borderRadius={12} />
                    ) : categoryHasBanner ? (
                        <img
                            src={categoryBanners[category.name]}
                            alt={`${category.name} Banner`}
                            className="w-full h-48 sm:h-64 lg:h-[30em] object-cover rounded-lg shadow-xl bg-center"
                        />
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-3 mb-16 items-center justify-center">
                    {loading && !isComingSoonCategory
                        ? Array(5)
                            .fill(0)
                            .map((_, i) => <Skeleton key={i} width={100} height={30} borderRadius={20} />)
                        : subcategories.map((sub) => (
                            <span
                                key={sub._id}
                                className="px-4 py-2 bg-gray-100 rounded-full shadow-sm text-sm font-medium hover:bg-gray-200 transition"
                            >
                                {sub.name}
                            </span>
                        ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {loading && !isComingSoonCategory
                        ? Array(10)
                            .fill(0)
                            .map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                                    <Skeleton height={150} borderRadius={8} />
                                    <Skeleton count={2} className="mt-2" />
                                    <Skeleton width={80} className="mt-2" />
                                </div>
                            ))
                        : products.map((p) => {
                            const productId = p.id || p._id;
                            return (
                                <Link to={`/product/${productId}`} key={productId} className="block">
                                    <ProductCard product={p} />
                                </Link>
                            );
                        })}
                </div>
            </section>
        </>
    );
}
