import Slider from "./Slider";
import Categories from "./Categories.jsx";
import BestSellers from "./BestSellers.jsx";
import FlashSale from "./FlashSale";
import NewArrivals from "./NewArrivals";
import Brands from "./Brands";
import { Helmet } from "react-helmet-async";


function Home() {
  return (
    <>
      <Helmet>
        <title>Home | SuperKart</title>
        <meta name="description" content="Shop the latest deals at SuperKart" />
      </Helmet>


      <div>
        <Slider />
        <Categories />
        <BestSellers />
        <FlashSale />
        <NewArrivals />
        <Brands />
      </div>
    </>
  );

}

export default Home;
