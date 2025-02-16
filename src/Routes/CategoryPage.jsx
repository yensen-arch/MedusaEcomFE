import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiShoppingCartLine,
} from "react-icons/ri";
import Footer from "../Components/Footer";

function CategoryPage() {
  const { categoryId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId, channel: "default-channel" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const products = data?.products?.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    price: node.pricing?.priceRange?.start?.gross?.amount || 0,
    images:
      node.media?.length > 0
        ? node.media.map((m) => m.url)
        : node.thumbnail?.url
        ? [node.thumbnail.url]
        : ["/placeholder.svg"],
  }));

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold mb-4">Category: {categoryId}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images =
    product.images.length > 1
      ? product.images
      : Array(4).fill(product.images[0]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prevImage = () =>
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextImage(); // Swipe left
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevImage(); // Swipe right
    }
  };

  return (
    <div className="outline outline-1 outline-black rounded-none overflow-hidden p-4 relative">
      <button className="absolute top-2 right-2 bg-white p-2 rounded-full  hover:bg-slate-200 z-50">
        <RiShoppingCartLine size={20} />
      </button>
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link to={`/products/${product.id}`} className="block">
          <img
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 ease-in-out"
          />
        </Link>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full"
            >
              <RiArrowLeftSLine size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full"
            >
              <RiArrowRightSLine size={24} />
            </button>
          </>
        )}
        <div className="flex justify-center mt-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentImage ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <Link to={`/products/${product.id}`} className="block">
        <div className="text-center mt-2 text-sm">
          {product.name.toUpperCase()}
          <p className="text-gray-600 text-xs">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}

export default CategoryPage;
