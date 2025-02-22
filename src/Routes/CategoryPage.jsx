import React, { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PRODUCTS_BY_CATEGORY,
  ADD_TO_CART,
  ADD_TO_NEW_CART,
} from "../graphql/queries";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import Footer from "../Components/Footer";
import CustomLoader from "../Components/CustomLoader";

function CategoryPage() {
  const { categoryId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId, channel: "default-channel" },
  });

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const products = data?.products?.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    price: node.pricing?.priceRange?.start?.gross?.amount || 0,
    variantId: node.variants[0]?.id,
    images:
      node.media?.length > 0
        ? node.media.map((m) => m.url)
        : node.thumbnail?.url
        ? [node.thumbnail.url]
        : ["/placeholder.svg"],
  }));

  return (
    <div className="py-28">
      <h1 className="text-xl font-semibold px-6 mb-4">
        {data?.products?.edges[0]?.node?.category?.name.toUpperCase()}
      </h1>
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
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);

  const handleProductClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API load time
    setLoading(false);
    setIsNavigating(true);
    navigate(`/products/${product.id}`);
  };
  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART);
  const [addToNewCart, { loading: newCartLoading }] =
    useMutation(ADD_TO_NEW_CART);
  const handleAddToCart = async () => {
    if (!product.variantId) {
      console.error("No variant ID available for product:", product.name);
      return;
    }
    let checkoutId = localStorage.getItem("checkoutId");
    if (!checkoutId) {
      const { data } = await addToNewCart({
        variables: {
          variantId: product.variantId,
          quantity: 1,
        },
      });
      if (data?.checkoutCreate?.errors.length) {
        console.error("Error adding to cart:", data.checkoutCreate.errors);
      } else {
        const checkoutId = data.checkoutCreate.checkout.id;
        localStorage.setItem("checkoutId", checkoutId);
        console.log("Added to cart, checkoutId saved:", checkoutId);
      }
      localStorage.setItem("checkoutId", data.checkoutCreate.checkout.id);
    } else {
      try {
        const { data } = await addToCart({
          variables: {
            checkoutId,
            variantId: product.variantId,
            quantity: 1,
          },
        });

        if (data?.checkoutLinesAdd?.errors.length) {
          console.error("Error adding to cart:", data.checkoutLinesAdd.errors);
        } else {
          const checkoutId = data.checkoutLinesAdd.checkout.id;
          localStorage.setItem("checkoutId", checkoutId);
          console.log("Added to cart, checkoutId saved:", checkoutId);
        }
      } catch (error) {
        console.error("Mutation error:", error);
      }
    }
  };

  return (
    <div className="outline outline-1 outline-black rounded-none overflow-hidden relative group">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isNavigating && (
          <div className="absolute top-2 right-2 z-10">
            <CustomLoader />
          </div>
        )}
        <Link
          to={`/products/${product.id}`}
          className="block"
          onClick={handleProductClick}
        >
          <img
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-[32rem] object-cover transition-transform duration-300 ease-in-out"
          />
          {loading && (
            <div className="absolute top-2 right-2  p-2  ">
              <CustomLoader className="animate-spin text-black" size={20} />
            </div>
          )}
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
        <div className="absolute w-full h-full flex items-center justify-center group overflow-hidden">
          <div className="absolute w-full text-center text-gray-600 transition-transform duration-300 group-hover:-translate-y-full  group-hover:opacity-0">
            {product.name.toUpperCase()}
            <br />
            <p className="text-xs">${product.price.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className=" transition-transform duration-300 absolute translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 border border-black text-black px-1 py-1 text-xs"
          >
            {cartLoading ? "ADDING..." : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
