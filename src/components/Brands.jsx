import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/brands"
        );
        setBrands(response.data.data);

        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError("Failed to fetch Brands. Please try again later.");
        console.error("Error fetching Brands:", err);
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="p-10 bg-slate-100">
      <h2 className="text-xl sm:text-4xl text-center font-extrabold text-[#7924CE] mb-4">
        OFFICIAL BRAND STORES
      </h2>
      <div className="w-24 h-1 bg-[#7924CE] mx-auto mb-10 rounded"></div>

      {error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : (
        <Swiper
          modules={[Navigation, Grid]}
          spaceBetween={20}
          slidesPerView={2}
          slidesPerGroup={2}
          grid={{ rows: 2, fill: "row" }}
          navigation
          className="mySwiper !px-8"
          breakpoints={{
            640: {
              slidesPerView: 2,
              grid: { rows: 2, fill: "row" },
              slidesPerGroup: 2,
            },
            768: {
              slidesPerView: 4,
              grid: { rows: 3, fill: "row" },
              slidesPerGroup: 4,
            },
          }}
        >
          {loading
            ? Array(12)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-24 flex items-center justify-center bg-white rounded-lg shadow-sm">
                    <Skeleton height={50} width={100} />
                  </div>
                </SwiperSlide>
              ))
            : brands.map((brand) => (
              <SwiperSlide key={brand._id}>
                <div className="w-full group sm:bg-white sm:rounded-lg sm:hover:shadow-lg sm:hover:shadow-purple-500 transition-all duration-300 sm:py-7 py-3 flex items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.title}
                    className="max-h-20 rounded-md object-contain grayscale group-hover:grayscale-0 group-hover:scale-125 transition duration-300"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
}

export default Brands;
