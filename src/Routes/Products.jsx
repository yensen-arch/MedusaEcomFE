import { useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import RelatedProducts from "../Components/RelatedProducts";
import Footer from "../Components/Footer";
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Product = () => {
  const { productId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId, channel: "default-channel" },
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const slideRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;
  const description = product.description || "";
  const images = product?.media?.length
    ? product.media.map((img) => img.url)
    : Array(4).fill(product?.thumbnail?.url || "/placeholder.svg");

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
      setTouchStart(0);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2  container mx-auto ">
        <div className="flex flex-col ">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-w-3  aspect-h-4 overflow-hidden border border-black"
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>
          ))}
        </div>
        <div className="sticky top-24 h-fit px-8 border border-black">
          <ProductInfo
            product={product}
            description={description}
            isProductDetailsOpen={isProductDetailsOpen}
            setIsProductDetailsOpen={setIsProductDetailsOpen}
            isShippingOpen={isShippingOpen}
            setIsShippingOpen={setIsShippingOpen}
            isCareOpen={isCareOpen}
            setIsCareOpen={setIsCareOpen}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div
          className="relative h-[90vh] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          ref={slideRef}
        >
          <div className="h-full relative">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-transform duration-300 ${
                  index === currentImageIndex
                    ? "translate-x-0"
                    : index < currentImageIndex
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-black" : "bg-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full"
            onClick={() =>
              currentImageIndex > 0 &&
              setCurrentImageIndex(currentImageIndex - 1)
            }
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full"
            onClick={() =>
              currentImageIndex < images.length - 1 &&
              setCurrentImageIndex(currentImageIndex + 1)
            }
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="px-4 py-8">
          <ProductInfo
            product={product}
            description={description}
            isProductDetailsOpen={isProductDetailsOpen}
            setIsProductDetailsOpen={setIsProductDetailsOpen}
            isShippingOpen={isShippingOpen}
            setIsShippingOpen={setIsShippingOpen}
            isCareOpen={isCareOpen}
            setIsCareOpen={setIsCareOpen}
          />
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={images[currentImageIndex]}
            alt="Fullscreen view"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
      <RelatedProducts productCategoryID={product.category?.id} />
      <Footer />
    </div>
  );
};

const ProductInfo = ({
  product,
  description,
  isProductDetailsOpen,
  setIsProductDetailsOpen,
  isShippingOpen,
  setIsShippingOpen,
  isCareOpen,
  setIsCareOpen,
}) => (
  <div className="space-y-6">
    <h1 className="text-xl font-semibold text-center">
      {product.name.toUpperCase()}
    </h1>
    <p className="text-xl text-center">
      {product.pricing.priceRange.start.gross.amount}{" "}
      {product.pricing.priceRange.start.gross.currency}
    </p>

    <div className="space-y-4">
      <select className="w-full py-4 bg-white text-black border border-black hover:bg-white hover:text-black transition-colors appearance-none px-4 pr-10">
        <option className="text-black bg-white" value="">
          SELECT SIZE
        </option>
        <option className="text-black bg-white" value="s">
          SMALL
        </option>
        <option className="text-black bg-white" value="m">
          MEDIUM
        </option>
        <option className="text-black bg-white" value="l">
          LARGE
        </option>
      </select>

      <button className="w-full py-4 bg-black text-white hover:bg-white hover:text-black border hover:border-black transition-colors">
        ADD TO CART
      </button>
    </div>

    <div className="space-y-4 pt-6">
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="text-sm leading-relaxed "
      />

      <Dropdown
        title="PRODUCT DETAILS"
        isOpen={isProductDetailsOpen}
        setIsOpen={setIsProductDetailsOpen}
        content={`Our signature piece crafted with premium materials. Features a unique design that combines modern aesthetics with timeless appeal. Made from sustainably sourced materials with attention to detail and quality craftsmanship.`}
      />

      <Dropdown
        title="SHIPPING & RETURNS"
        isOpen={isShippingOpen}
        setIsOpen={setIsShippingOpen}
        content={
          <>
            Free standard shipping on orders over $200.
            <br />
            <br />
            Express shipping available.
            <br />
            <br />
            <a href="/refund-policy" className="underline">
              View our refund policy
            </a>
          </>
        }
      />

      <Dropdown
        title="CARE INSTRUCTIONS"
        isOpen={isCareOpen}
        setIsOpen={setIsCareOpen}
        content="Hand wash in cold water. Do not bleach. Lay flat to dry. Iron on low heat if needed. Store in a cool, dry place."
      />
    </div>
  </div>
);

const Dropdown = ({ title, isOpen, setIsOpen, content }) => (
  <div className="border-t border-black pt-4">
    <button
      className="w-full flex justify-between items-center py-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      {title}
      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
    </button>
    {isOpen && <div className="py-4 text-sm">{content}</div>}
  </div>
);

export default Product;
