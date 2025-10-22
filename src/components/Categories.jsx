import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/categories", {
          params: {
            limit: 20,
            page: 1,
          },
        });
        const selectedCategories = response.data.data;
        setCategories(selectedCategories);
      } catch (err) {
        setError("Failed to fetch categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 md:px-14">
        {Array(10)
          .fill()
          .map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-3">
              <Skeleton height={150} className="mb-3 rounded-md" />
              <Skeleton height={20} width="80%" className="mb-2" />
              <Skeleton height={20} width="40%" />
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center ml-6 mb-7 mt-4">
        <div className="h-10 w-1 bg-[#7924CE] mr-2 ml-4 rounded"></div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#7924CE]">
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7 px-7">
        {categories.map((cat) => (
          <Link
            to={`/categories/${cat._id}`}
            key={cat._id}
            className="bg-white rounded-xl shadow-md overflow-hidden 
                       hover:shadow-2xl hover:scale-105 
                       transition-transform duration-300 ease-in-out cursor-pointer group"
          >
            <div className="w-full h-40 relative overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-indigo-300 bg-opacity-0 group-hover:bg-opacity-20 transition duration-300"></div>
            </div>

            <h3 className="font-semibold text-gray-800 text-lg text-center p-3 group-hover:text-[#7924CE] transition-colors">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
