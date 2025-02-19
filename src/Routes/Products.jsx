import { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID, ADD_TO_CART } from "../graphql/queries";
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
  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;
  const description = product.description || "";
  const variation = product.variants || [];
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
      <div className="hidden md:grid md:grid-cols-2 border-b border-black container mx-auto ">
        <div className="flex flex-col ">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-w-3 h-120 overflow-hidden border border-black"
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
        <div className="sticky top-24 h-fit px-8 ">
          <ProductInfo
            product={product}
            description={description}
            isProductDetailsOpen={isProductDetailsOpen}
            setIsProductDetailsOpen={setIsProductDetailsOpen}
            isShippingOpen={isShippingOpen}
            setIsShippingOpen={setIsShippingOpen}
            isCareOpen={isCareOpen}
            setIsCareOpen={setIsCareOpen}
            addToCart={addToCart}
            cartLoading={cartLoading}
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
            addToCart={addToCart}
            cartLoading={cartLoading}
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
  addToCart,
  cartLoading,
}) => {
  const handleAddToCart = async () => {
    if (!product.variants?.[0]) {
      console.error("No variant ID available for product:", product.name);
      return;
    }
    try {
      const { data } = await addToCart({
        variables: {
          variantId: product.variants[0].id,
          quantity: 1,
        },
      });

      if (data?.checkoutCreate?.errors.length) {
        console.error("Error adding to cart:", data.checkoutCreate.errors);
      } else {
        console.log("Added to cart:", data.checkoutCreate.checkout);
      }
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  return (
    <div className="space-y-1 mt-14 items-center flex flex-col">
      <h1 className="text-md font-bold  text-center">
        {product.name.toUpperCase()}
      </h1>
      <p className="text-sm text-center">
        {product.pricing.priceRange.start.gross.amount}{" "}
        {product.pricing.priceRange.start.gross.currency}
      </p>
      <div className="w-[90%] md:w-[80%] lg:w-[60%]">
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="text-sm py-4"
        />

        <div className="flex flex-col items-center space-y-2 ">
          <div className="relative w-full group">
            <select className="w-full py-2 bg-white text-sm text-black border border-black hover:bg-white hover:text-black transition-colors appearance-none px-2">
              <option className="text-black bg-white" value="">
                SELECT SIZE
              </option>
              <option className="text-black bg-white text-xs" value="s">
                SMALL
              </option>
              <option className="text-black bg-white text-xs" value="m">
                MEDIUM
              </option>
              <option className="text-black bg-white text-xs" value="l">
                LARGE
              </option>
            </select>
            <span className="absolute right-2 text-xs top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              ▼
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="w-full py-2 bg-black text-sm text-white hover:bg-white hover:text-black border hover:border-black transition-colors"
          >
            {cartLoading ? "Adding..." : "ADD TO CART"}
          </button>
        </div>

        <div className="space-y-4 pt-6 text-xs uppercase">
          <Dropdown
            title="PRODUCT DETAILS"
            isOpen={isProductDetailsOpen}
            setIsOpen={setIsProductDetailsOpen}
            content={`OUR SIGNATURE PIECE CRAFTED WITH PREMIUM MATERIALS. FEATURES A UNIQUE DESIGN THAT COMBINES MODERN AESTHETICS WITH TIMELESS APPEAL. MADE FROM SUSTAINABLY SOURCED MATERIALS WITH ATTENTION TO DETAIL AND QUALITY CRAFTSMANSHIP.`}
          />

          <Dropdown
            title="SHIPPING & RETURNS"
            isOpen={isShippingOpen}
            setIsOpen={setIsShippingOpen}
            content={
              <>
                FREE STANDARD SHIPPING ON ORDERS OVER $200.
                <br />
                EXPRESS SHIPPING AVAILABLE.
                <br />
                RETURNS ACCEPTED WITHIN 30 DAYS OF PURCHASE.
                <br />
                <br />
                <a
                  href="/help/shipping"
                  className="underline text-xs uppercase"
                >
                  READ MORE
                </a>
              </>
            }
          />

          <Dropdown
            title="CARE INSTRUCTIONS"
            isOpen={isCareOpen}
            setIsOpen={setIsCareOpen}
            content="HAND WASH IN COLD WATER. DO NOT BLEACH. LAY FLAT TO DRY. IRON ON LOW HEAT IF NEEDED. STORE IN A COOL, DRY PLACE."
          />
        </div>
      </div>
    </div>
  );
};

const Dropdown = ({ title, isOpen, setIsOpen, content }) => (
  <div className="border-t border-black pt-2">
    <button
      className="w-full flex justify-between items-center py-1"
      onClick={() => setIsOpen(!isOpen)}
    >
      {title}
      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
    </button>
    {isOpen && <div className="py-4 text-xs">{content}</div>}
  </div>
);

export default Product;
