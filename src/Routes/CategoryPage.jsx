import React, { useState, useRef, useEffect } from "react";
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
      <h1 className="text-lg font-semibold px-6 mb-4">
        {data?.products?.edges[0]?.node?.category?.name.toUpperCase()}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 ">
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
  const [slideDirection, setSlideDirection] = useState("right");
  const navigate = useNavigate();
  const images =
    product.images.length > 1
      ? product.images
      : Array(1).fill(product.images[0]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStarted = useRef(false);

  const prevImage = () => {
    setSlideDirection("left");
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSlideDirection("right");
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStarted.current = true;
  };

  const handleTouchMove = (e) => {
    if (!touchStarted.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStarted.current) return;

    const swipeDistance = touchStartX.current - touchEndX.current;

    // Only trigger swipe if distance is significant (more than 30px)
    if (Math.abs(swipeDistance) > 30) {
      if (swipeDistance > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStarted.current = false;
  };

  const handleTouchCancel = () => {
    touchStarted.current = false;
  };

  const [loading, setLoading] = useState(false);

  const handleProductClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating API load time
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
            const cartItems = newCartData.checkoutCreate.checkout.lines.length;
            localStorage.setItem("cartCount", cartItems);
          }
        } else {
          console.error("Error adding to cart:", data.checkoutLinesAdd.errors);
        }
      } else {
        const checkoutId = data.checkoutCreate.checkout.id;
        localStorage.setItem("checkoutId", checkoutId);
        const cartItems = data.checkoutCreate.checkout.lines.length;
        localStorage.setItem("cartCount", cartItems);
      }
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
          const cartItems = data.checkoutLinesAdd.checkout.lines.length;
          localStorage.setItem("cartCount", cartItems);
        }
      } catch (error) {
        console.error("Mutation error:", error);
      }
    }
  };

  return (
    <div className="outline outline-1 outline-black rounded-none overflow-hidden relative group">
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
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
          <div className="relative overflow-hidden w-full h-[20rem] sm:h-[32rem]">
            <img
              src={images[currentImage]}
              alt={product.name}
              className={`w-auto h-[20rem] sm:h-[32rem] object-cover absolute transition-transform duration-300 ease-in-out ${
                slideDirection === "right"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          {loading && (
            <div className="absolute top-2 right-2 p-2">
              <CustomLoader size={20} />
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
      </div>
      <div className="text-center mt-2 text-xs relative h-12">
        <div className="absolute w-full h-full flex items-center justify-center group overflow-hidden">
          <div className="absolute w-full text-center text-gray-600 transition-transform duration-300 group-hover:-translate-y-full group-hover:opacity-0">
            {product.name.toUpperCase()}
            <br />
            <p className="text-xs">${product.price.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="transition-transform duration-300 absolute translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 border border-black text-black px-1 py-1 text-xs"
          >
            {cartLoading ? "ADDED" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
