//src/Routes/Products.jsx
import { useState, useRef, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import ScarcityModal from "../Components/checkout/ScarcityModal";

const Product = () => {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
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
  const images = product?.media?.length
    ? product.media.map((img) => {
        // Add Cloudinary optimization parameters
        const baseUrl = img.url;
        return `${baseUrl}?auto=format,compress&q=auto`;
      })
    : Array(1).fill(
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

  return (
    <div className="min-h-screen mt-20">
      <ScarcityModal />
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 border-b border-r border-black w-full">
        {/* Image gallery - 8/12 columns on large screens, 7/12 on medium */}
        <div className="col-span-7 lg:col-span-8 flex flex-col w-full">
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

        {/* Product details - 4/12 columns on large screens, 5/12 on medium */}
        <div className="col-span-5 lg:col-span-4 sticky top-24 h-fit">
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
      <div className="md:hidden ">
        <div className="relative h-[90vh] overflow-hidden">
          <div className="h-full relative mt-2">
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
                  className="w-full h-full object-contain"
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
  const [cartAdded, setCartAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (localStorage.getItem("token") === null) {
      // this case is for the fresh user.
      window.location.href = "/login";
    }
    const selectedVariant = product.variants.find((variant) =>
      variant.attributes.some(
        (attr) =>
          attr.attribute.name === "Size" &&
          attr.values.some((val) => val.name === selectedSize)
      )
    );

    if (!selectedVariant) {
      console.error("No variant found for selected size:", selectedSize);
      return;
    }

    let checkoutId = localStorage.getItem("checkoutId");
    const variables = {
      variantId: selectedVariant.id,
      quantity: 1,
    };

    if (!checkoutId) {
      const { data } = await addToNewCart({ variables });
      if (data?.checkoutCreate?.errors.length) {
        console.error("Error adding to cart:", data.checkoutCreate.errors);
      } else {
        const newCheckoutId = data.checkoutCreate.checkout.id;
        localStorage.setItem("checkoutId", newCheckoutId);
        const cartItems = data.checkoutCreate.checkout.lines.length;
        localStorage.setItem("cartCount", cartItems);
      }
    } else {
      try {
        const { data } = await addToCart({
          variables: { checkoutId, ...variables },
        });

        if (data?.checkoutLinesAdd?.errors.length) {
          // Check if the error is because of an invalid checkout ID
          if (
            data.checkoutLinesAdd.errors.some((err) =>
              err.message.includes("Couldn't resolve to a node")
            )
          ) {
            // Clear the invalid checkout ID
            localStorage.removeItem("checkoutId");
            // Create a new checkout instead
            const { data: newCartData } = await addToNewCart({ variables });
            if (newCartData?.checkoutCreate?.errors.length) {
              console.error(
                "Error creating new cart:",
                newCartData.checkoutCreate.errors
              );
            } else {
              const newCheckoutId = newCartData.checkoutCreate.checkout.id;
              localStorage.setItem("checkoutId", newCheckoutId);
              const cartItems =
                newCartData.checkoutCreate.checkout.lines.length;
              localStorage.setItem("cartCount", cartItems);
            }
          } else {
            console.error(
              "Error adding to cart:",
              data.checkoutLinesAdd.errors
            );
          }
        } else {
          const updatedCheckoutId = data.checkoutLinesAdd.checkout.id;
          localStorage.setItem("checkoutId", updatedCheckoutId);
          const cartItems = data.checkoutLinesAdd.checkout.lines.length;
          localStorage.setItem("cartCount", cartItems);
        }
      } catch (error) {
        console.error("Mutation error:", error);
      }
    }
  };

  // Redirect to /checkout when cartAdded is true
  useEffect(() => {
    if (cartAdded) {
      navigate("/checkout");
    }
  }, [cartAdded, navigate]);

  const [selectedSize, setSelectedSize] = useState("");
  const selectRef = useRef(null);
  const validateAndHandle = (callback) => (e) => {
    if (!selectedSize) {
      e.preventDefault();
      selectRef.current.classList.add(
        "animate-shake",
        "border-red-500",
        "border-2"
      );
      setTimeout(() => {
        selectRef.current.classList.remove(
          "animate-shake",
          "border-red-500",
          "border-2"
        );
      }, 820);
      return;
    }
    callback(e);
  };
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
          dangerouslySetInnerHTML={{ __html: description.toUpperCase() }}
          className="text-xs py-4"
        />
        <div className="flex flex-col items-center space-y-2 ">
          <div className="relative w-full group">
            <select
              ref={selectRef}
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
            onClick={validateAndHandle(handleAddToCart)}
            disabled={cartLoading}
            className="w-full py-2 bg-black text-xs text-white hover:bg-white hover:text-black border hover:border-black transition-colors"
          >
            {cartLoading ? "ADDED" : "ADD TO CART"}
          </button>
          <button
            onClick={validateAndHandle(async () => {
              await handleAddToCart();
              setCartAdded(true);
            })}
            disabled={cartLoading}
            className="w-full flex items-center justify-center text-center py-2 bg-black text-xs text-white hover:bg-white hover:text-black border hover:border-black transition-colors"
          >
            {cartLoading ? <CustomLoader /> : "PREORDER NOW"}
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
                FREE STANDARD SHIPPING ON ALL ORDERS.
                <br />
                EXPRESS SHIPPING AVAILABLE.
                {/* <br />
                RETURNS ACCEPTED WITHIN 30 DAYS OF PURCHASE. */}
                <br />
                {/* <br /> */}
                {/* <a
                  href="/help/shipping"
                  className="underline text-xs uppercase"
                >
                  READ MORE
                </a> */}
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
      <div className=" uppercase bg-green-50 border border-black text-[0.6rem] p-2">
        ONE PURCHASED = ONE DONATED
      </div>
      {/* <div className="space-y-4">
        <div className="flex justify-center gap-2 pt-6">
          {[
            {
              name: "visa",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg",
            },
            {
              name: "mastercard",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg",
            },
            {
              name: "amex",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/americanexpress.svg",
            },
            {
              name: "paypal",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg",
            },
            {
              name: "google-pay",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlepay.svg",
            },
            {
              name: "apple-pay",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg",
            },
            {
              name: "klarna",
              url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/klarna.svg",
            },
          ].map((payment) => (
            <img
              key={payment.name}
              src={payment.url}
              alt={payment.name}
              className="w-8 h-5 object-contain"
            />
          ))}
        </div>
      </div> */}
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
