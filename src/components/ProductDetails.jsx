import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import YouMayLike from "./YouMayLike";
import { useCart } from "./Context/CartContext";
import { useWishList } from "./Context/WishListContext";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";



import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ROUTE_MISR_API = "https://ecommerce.routemisr.com/api/v1";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [isInWishList, setIsInWishList] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const { addProductToCart } = useCart();
  const { wishList, addProductToWishList, deleteWishListProduct } = useWishList();

  useEffect(() => {
    if (wishList && product?._id) {
      setIsInWishList(wishList.some((item) => item._id === product._id));
    }
  }, [wishList, product]);

  const handleToggleWishList = async () => {
    if (!product) return;
    try {
      if (isInWishList) {
        await deleteWishListProduct(product._id);
        setIsInWishList(false);
      } else {
        await addProductToWishList(product._id);
        setIsInWishList(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  useEffect(() => {
    if (!loading && !product) {
      navigate("/not-found", { replace: true });
    }
  }, [loading, product, navigate]);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ROUTE_MISR_API}/products/${productId}`);
        const productData = res.data.data;

        let brandData = null;
        if (productData?.brand?._id) {
          const brandRes = await axios.get(`${ROUTE_MISR_API}/brands/${productData.brand._id}`);
          brandData = brandRes.data.data;
        }

        if (!mounted) return;
        setProduct(productData);
        setBrand(brandData);

        const imagesToUse = productData?.images?.length
          ? productData.images
          : [productData?.imageCover || "https://via.placeholder.com/400"];
        setMainImage(imagesToUse[0]);
      } catch (err) {
        console.error(`Error fetching product ID ${productId}:`, err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | SuperKart`;
    } else {
      document.title = "SuperKart";
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addProductToCart(product._id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };


  const handleBuyNowOrder = () => {
    if (!product?._id || isBuyingNow) return;
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("You need to login first");
      return;
    }
    setIsBuyingNow(true);
    setTimeout(() => {
      navigate("/checkout", {
        state: {
          productId: product._id,
        },
      });
    }, 500);
  };





  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton height={400} borderRadius={8} />
          <div className="flex flex-col justify-center">
            <Skeleton width={120} height={20} className="mb-4" />
            <Skeleton height={36} className="mb-2" />
            <Skeleton count={2} height={20} className="mb-6" />
            <Skeleton width={100} height={28} className="mb-4" />
            <Skeleton width={150} height={32} className="mb-6" />
            <Skeleton width={150} height={40} />
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.imageCover || "https://via.placeholder.com/400"];
  const ratingValue = Math.round(Number(product.ratingsAverage) || 0);
  const ratingCount = product.ratingsQuantity || 0;
  const showThumbnails = images.length > 1;
  const brandName = brand?.name || product?.brand?.name || "No Brand";
  const brandLogo = brand?.image || product?.brand?.image || "https://via.placeholder.com/100x50?text=Logo";
  const categoryName = product?.category?.name || "Category";
  const categoryId = product?.category?._id;

  const Breadcrumbs = () => (
    <nav className="mb-8 p-2">
      <ol className="flex items-center text-sm text-gray-500">
        <li className="flex items-center">
          <Link to="/" className="hover:text-purple-600 font-medium transition">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
        </li>
        <li className="text-gray-900 font-semibold">{categoryName}</li>
      </ol>
    </nav>
  );

  return (
    <>

      <section className="p-11 max-w-6xl mx-auto">
        <Breadcrumbs />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            <div className="relative mb-4">
              <button
                onClick={handleToggleWishList}
                className="absolute top-4 sm:-right-15 right-2 cursor-pointer bg-slate-50 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-6 h-6 transition-all duration-200 ${isInWishList
                    ? "fill-purple-700 text-purple-700 scale-110"
                    : "text-purple-700"
                    }`}
                />
              </button>
              <img
                src={mainImage}
                alt={product.title}
                className=" w-full  max-h-[35rem]  rounded-2xl border"
              />
            </div>

            {showThumbnails && (
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={false}
                spaceBetween={10}
                slidesPerView={3}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={`Thumbnail ${i}`}
                      onClick={() => setMainImage(img)}
                      className={`w-full h-24 object-cover rounded-lg cursor-pointer border mt-3 ${img === mainImage
                        ? "border-purple-600 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-purple-400"
                        }`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="flex flex-col justify-center -translate-y-14">
            <div className="flex items-center mb-6">
              <img
                src={brandLogo}
                alt={`${brandName} Logo`}
                className="w-24 h-16 object-contain mr-3 grayscale hover:grayscale-0 transition bg-white shadow-lg"
              />
              <span className="text-sm text-gray-500 font-medium hover:text-purple-600 cursor-pointer">
                More from {brandName}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4  line-clamp-2">{product.title}</h1>
            <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < ratingValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-2 text-gray-500">({ratingCount} reviews)</span>
            </div>

            <p className="text-2xl font-bold text-slate-800 mb-8">
              EGP {product.price}
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isBuyingNow}
                className={`flex items-center justify-center gap-2  py-2 bg-purple-600 text-white font-semibold rounded-lg transition shadow-md w-40 ${isAddingToCart ? "bg-purple-400 cursor-not-allowed" : "hover:bg-purple-700"
                  }`}
              >
                {isAddingToCart ? (
                  <ClipLoader color={"#fff"} size={20} />

                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}

              </button>
              <button
                onClick={handleBuyNowOrder}
                disabled={isAddingToCart || isBuyingNow}
                className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition w-40 ${isBuyingNow
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}              >
                {isBuyingNow ? (
                  <ClipLoader color={"#fff"} size={20} />

                ) : (
                  " Buy Now"
                )}

              </button>
            </div>
          </div>
        </div>

        {categoryId && (
          <YouMayLike categoryId={categoryId} currentProductId={product._id} />
        )}
      </section>
    </>
  );
}
