"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY, ADD_TO_CART } from "../graphql/queries";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import CustomLoader from "./CustomLoader";
function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images =
    product.media?.length > 0
      ? product.media.map((m) => m.url)
      : [product.thumbnail?.url || "/placeholder.svg"];

  // Duplicate the image if only one exists
  const displayImages = images.length > 1 ? images : Array(4).fill(images[0]);

  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  const nextImage = () =>
    setCurrentImage((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextImage();
    else if (touchEndX.current - touchStartX.current > 50) prevImage();
  };
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API load time
    setLoading(false);
    navigate(`/products/${product.id}`);
  };

  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART);

  console.log(product.variants[0].id)
  const handleAddToCart = async () => {
    if (!product.variants[0].id) {
      console.error("No variant ID available for product:", product.name);
      return;
    }
    try {
      const { data } = await addToCart({
        variables: { variantId: product.variants[0].id, quantity: 1 },
      });
      if (data?.checkoutCreate?.errors.length) {
        console.error("Error adding to cart:", data.checkoutCreate.errors);
      } else {
        const checkoutId = data.checkoutCreate.checkout.id;
        localStorage.setItem("checkoutId", checkoutId);
        console.log("Added to cart, checkoutId saved:", checkoutId);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="outline outline-1 outline-black rounded-none overflow-hidden p-4 relative group">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          to={`/products/${product.id}`}
          className="block"
          onClick={handleProductClick}
        >
          <img
            src={displayImages[currentImage]}
            alt={product.name}
            className="w-full h-[32rem] object-cover transition-transform duration-300 ease-in-out"
          />
          {loading && (
            <div className="absolute top-2 right-2  p-2  ">
              <CustomLoader className="animate-spin text-black" size={20} />
            </div>
          )}
        </Link>
        {displayImages.length > 1 && (
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
          {displayImages.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-1 h-1 mx-1 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentImage ? "bg-black scale-125" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="text-center mt-2 text-sm relative h-12">
        <div className="absolute w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-x-180">
          <div className="absolute w-full text-center text-gray-600 group-hover:opacity-0 transition-opacity duration-300">
            {product.name.toUpperCase()}
            <br />
            <p className="text-xs">
              ${product.pricing?.priceRange?.start?.gross?.amount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="hover:scale-110 transition-transform duration-300 absolute rounded-none opacity-0 border border-black text-black px-1 py-1 group-hover:opacity-100 text-xs"
          >
            {cartLoading ? "ADDING..." : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchProducts({ selectedCategory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryId: selectedCategory?.id,
      channel: "default-channel",
    },
    skip: !selectedCategory?.id,
  });

  useEffect(() => {
    if (selectedCategory) {
      setSearchQuery(selectedCategory.name);
    }
  }, [selectedCategory]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  const products =
    data?.products?.edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      media: node.media,
      thumbnail: node.thumbnail,
      pricing: node.pricing,
      variants: node.variants,
      category: node.category,
    })) || [];
  const filteredProducts = !searchQuery
    ? products
    : products.filter((product) => {
        const searchTerm = searchQuery.toLowerCase().trim();
        const regex = new RegExp(searchTerm.replace(/s$/, ""), "i");

        return (
          regex.test(product.name) ||
          regex.test(product.category?.name || "") ||
          regex.test(product.slug) ||
          regex.test(
            String(product.pricing?.priceRange?.start?.gross?.amount || "")
          )
        );
      });
  const categorizedProducts = {};
  filteredProducts.forEach((product) => {
    const category = product.category?.name || "UNCATEGORIZED";
    if (!categorizedProducts[category]) {
      categorizedProducts[category] = [];
    }
    categorizedProducts[category].push(product);
  });

  return (
    <div className="py-28">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center px-4">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-b border-black text-center text-lg outline-none px-2 py-1 w-full sm:w-3/4 md:w-1/2"
        />
      </div>
      <p className="text-lg pb-8 px-6">YOU MAY BE LOOKING FOR</p>

      {/* Product Categories */}
      {Object.entries(categorizedProducts).map(([category, products]) => (
        <div key={category} className="mb-8">
          <h3 className="text-2xl font-semibold px-6 mb-4">
            {category.toUpperCase()}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchProducts;
