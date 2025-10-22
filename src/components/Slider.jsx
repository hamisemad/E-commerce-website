import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Banner1 from "../assets/images/banner.jpg";
import Banner2 from "../assets/images/banner 4.jpg";
import Banner3 from "../assets/images/banner 5.jpg";
import Banner4 from "../assets/images/banner 6.jpg";
import Banner5 from "../assets/images/banner 7.jpg";
import Banner6 from "../assets/images/banner 8.jpg";
import Banner7 from "../assets/images/banner 9.jpg";

const banners = [
  { id: 1, image: Banner1 },
  { id: 2, image: Banner2 },
  { id: 3, image: Banner3 },
  { id: 4, image: Banner4 },
  { id: 5, image: Banner5 },
  { id: 6, image: Banner6 },
  { id: 7, image: Banner7 },
];

export default function BannerSlider() {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-[20em] sm:w-[40em] md:w-[50em] lg:w-[90em]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop={true}
          className="rounded-2xl shadow-lg" >
          {banners.map((Banner) => (
            <SwiperSlide key={Banner.id}>
              <div
                className="
              relative 
              h-[13em] sm:h-[16em] md:h-[25em] lg:h-[30em] 
              flex items-center justify-center 
               bg-no-repeat  bg-center bg-cover "
                style={{ backgroundImage: `url(${Banner.image})` }}
              >
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
