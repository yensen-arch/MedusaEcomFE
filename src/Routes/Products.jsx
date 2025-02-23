import { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GET_PRODUCT_BY_ID,
  ADD_TO_CART,
  ADD_TO_NEW_CART,
} from "../graphql/queries";
import RelatedProducts from "../Components/RelatedProducts";
import Footer from "../Components/Footer";
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import CustomLoader from "../Components/CustomLoader";
import { Link } from "react-router-dom";
const Product = () => {
  const { productId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId, channel: "default-channel" },
  });

  const sizes = data?.product?.variants.map(
    (variant) =>
      variant.attributes.find((attr) => attr.attribute.name === "Size")
        ?.values[0]?.name
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART);
  const [addToNewCart, { loading: newCartLoading }] =
    useMutation(ADD_TO_NEW_CART);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;
  // const description = product.description || "";
  const variation = product.variants || [];
  const images = product?.media?.length
    ? product.media.map((img) => {
        // Add Cloudinary optimization parameters
        const baseUrl = img.url;
        return `${baseUrl}?auto=format,compress&q=auto`;
      })
    : Array(4).fill(
        product?.thumbnail?.url
          ? `${product.thumbnail.url}?auto=format,compress&q=auto`
          : "/placeholder.svg"
      );
  let description = "";
  try {
    const parsedDescription = JSON.parse(product.description);
    description = parsedDescription.blocks
      .map((block) => block.data.text)
      .join(" ");
  } catch (error) {
    console.error("Invalid JSON:", error);
  }

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
      <div className="hidden md:grid md:grid-cols-[70%_30%] border-b border-r border-black container mx-auto ">
        <div className="flex flex-col w-full">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-w-3 h-120 overflow-hidden border border-black"
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover transition-transform cursor-pointer"
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
              />
            </div>
          ))}
        </div>
        <div className="sticky top-24 h-fit">
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
            addToNewCart={addToNewCart}
            newCartLoading={newCartLoading}
            sizes={sizes}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="relative h-[90vh] overflow-hidden">
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
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : "auto"}
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2  p-2 rounded-full"
            onClick={() =>
              currentImageIndex > 0 &&
              setCurrentImageIndex(currentImageIndex - 1)
            }
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
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
            addToNewCart={addToNewCart}
            newCartLoading={newCartLoading}
            sizes={sizes}
          />
        </div>
      </div>

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
  addToNewCart,
  cartLoading,
  newCartLoading,
  sizes,
}) => {
  const handleAddToCart = async () => {
    if (!product.variants?.[0]) {
      console.error("No variant ID available for product:", product.name);
      return;
    }
    let checkoutId = localStorage.getItem("checkoutId");
    if (!checkoutId) {
      const { data } = await addToNewCart({
        variables: {
          variantId: product.variants[0].id,
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
            variantId: product.variants[0].id,
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
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div className="space-y-1 mt-14 items-center flex flex-col">
      <h1 className="text-md font-bold  text-center">
        {product.name.toUpperCase()}
      </h1>
      <p className="text-sm text-center">
        ${product.pricing.priceRange.start.gross.amount}{" "}
      </p>
      <div className="w-[90%] md:w-[80%] lg:w-[90%]">
        <div
          dangerouslySetInnerHTML={{ __html: description.toUpperCase()  }}
          className="text-xs py-4"
        />
        <div className="flex flex-col items-center space-y-2 ">
          <div className="relative w-full group">
            <select
              className="w-full py-2 bg-white text-xs text-black border border-black hover:bg-white hover:text-black transition-colors appearance-none px-2"
              onChange={(e) => setSelectedSize(e.target.value)}
              value={selectedSize}
              defaultValue=""
            >
              <option
                className="text-black bg-white"
                value=""
                disabled
                selected
              >
                SELECT SIZE
              </option>
              {sizes?.map((size) => (
                <option
                  className="text-black bg-white text-xs"
                  value={size}
                  key={size}
                >
                  {size}
                </option>
              ))}
            </select>
            <span className="absolute right-2 text-xs top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              ▼
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="w-full py-2 bg-black text-xs text-white hover:bg-white hover:text-black border hover:border-black transition-colors"
          >
            {cartLoading ? "ADDING..." : "ADD TO CART"}
          </button>
          <Link
            onClick={handleAddToCart}
            disabled={cartLoading}
            to="/checkout"
            className="w-full text-center py-2 bg-black text-xs text-white hover:bg-white hover:text-black border hover:border-black transition-colors"
          >
             BUY NOW
            </Link>
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
