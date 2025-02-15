import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import RelatedProducts from "../Components/RelatedProducts";
import Footer from "../Components/Footer";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
const Product = () => {
  const { productId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId, channel: "default-channel" },
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;
  const description = product.description || "";

  const images = product?.media?.length
    ? product.media.map((img) => img.url)
    : Array(4).fill(product?.thumbnail?.url || "/placeholder.svg");

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  return (
    <>
      <style>
        {`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}
      </style>
      <div className="container min-h-screen mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Scrolling Images */}
        <div className="flex flex-col overflow-y-auto h-screen scrollbar-hide">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} view ${index + 1}`}
              className="w-full h-auto object-cover cursor-pointer border border-black "
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-6 py-4 text-center">
          <h1 className="text-xl font-bold">{product.name.toUpperCase()}</h1>
          <p className="text-md ">
            {product.pricing.priceRange.start.gross.amount}{" "}
            {product.pricing.priceRange.start.gross.currency}
          </p>
          <button className="w-full py-3 px-4 text-center hover:bg-black hover:text-white ">
            ADD TO CART
          </button>
          <p className="text-gray-500">
            CATEGORY: {product.category?.name.toUpperCase()}
          </p>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>

          {/* PRODUCT DETAILS Dropdown */}
          <div className="border-t border-gray-300 pt-2">
            <button
              className="w-full text-left  py-2 flex justify-between"
              onClick={() => setIsProductDetailsOpen(!isProductDetailsOpen)}
            >
              PRODUCT DETAILS
              <span>{isProductDetailsOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
            </button>
            {isProductDetailsOpen && (
              <p className="text-sm text-gray-600">
                - Material: Cotton <br />
                - Color: Blue <br />- Made in India
              </p>
            )}
          </div>

          {/* SHIPPING Dropdown */}
          <div className="border-t border-gray-300 pt-2">
            <button
              className="w-full text-left  py-2 flex justify-between"
              onClick={() => setIsShippingOpen(!isShippingOpen)}
            >
              SHIPPING
              {isShippingOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isShippingOpen && (
              <p className="text-sm text-gray-600">
                - Free shipping on orders above $50 <br />- Delivered within 5-7
                business days
              </p>
            )}
          </div>
        </div>

        {/* Lightbox Overlay */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <img
              src={images[selectedImageIndex]}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
      <RelatedProducts productCategoryID={product.category?.id} />
      <Footer />
    </>
  );
};

export default Product;
