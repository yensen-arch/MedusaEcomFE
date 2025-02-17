import React, { useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function RelatedProducts({ productCategoryID }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId: productCategoryID, channel: "default-channel" },
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
    <div className="py-20">
      <h2 className="text-md  mb-6 text-center">COMPLETE YOUR STYLE</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
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

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextImage();
    else if (touchEndX.current - touchStartX.current > 50) prevImage();
  };

  return (
    <div className="border border-black rounded-none overflow-hidden relative group">
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
            className="w-full h-[32rem] object-cover transition-transform duration-300 ease-in-out"
          />
        </Link>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <RiArrowLeftSLine size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <RiArrowRightSLine size={24} />
            </button>
          </>
        )}
        <div className="flex justify-center mt-2">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-1 h-1 mx-1 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentImage ? "bg-black scale-125" : "bg-gray-200"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <div className="text-center mt-2 text-sm relative h-12">
        <div className="absolute w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-x-180">
          <div className="absolute w-full text-center text-gray-600 group-hover:opacity-0 transition-opacity duration-300">
            {product.name.toUpperCase()}
            <br />
            <p className="text-xs">${product.price.toFixed(2)}</p>
          </div>
          <button className="hover:scale-110 transition-transform duration-300 absolute rounded-none opacity-0 border border-black text-black px-1 py-1 group-hover:opacity-100 text-xs">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
