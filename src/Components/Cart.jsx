"use client";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CART_ITEMS,
  REFRESH_TOKEN_MUTATION,
  CHECKOUT_LINES_UPDATE,
} from "../graphql/queries";
import CustomLoader from "./CustomLoader";

function Cart({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);
  const [updateCheckoutLines] = useMutation(CHECKOUT_LINES_UPDATE);

  const { data, loading, error, refetch } = useQuery(GET_CART_ITEMS, {
    variables: { checkoutId },
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    skip: !checkoutId,
    fetchPolicy: "network-only",
    onError: async (error) => {
      if (error.message.includes("Signature has expired")) {
        try {
          setIsLoading(true);
          const { data: refreshData } = await refreshTokenMutation({
            variables: { refreshToken },
          });

          if (refreshData?.tokenRefresh?.token) {
            localStorage.setItem("token", refreshData.tokenRefresh.token);
            refetch();
          } else {
            console.error("Token refresh failed.");
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
        } finally {
          setIsLoading(false);
        }
      }
    },
  });

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300);
  }, [isOpen]);

  const handleQuantityChange = async (variantId, quantity) => {
    try {
      setIsLoading(true);
      const { data } = await updateCheckoutLines({
        variables: {
          checkoutId,
          lines: [{ variantId, quantity }],
        },
        context: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      });
      const cartItems = data.checkoutLinesUpdate.checkout.lines.length;
      localStorage.setItem("cartCount", cartItems);
      refetch();
    } catch (err) {
      console.error("Error updating cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 " onClick={onClose}>
      <div
        className={`border border-black overflow-y-auto fixed top-0 right-0 w-full sm:w-[500px] h-screen bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex px-2 justify-between border-b border-black items-center pb-[9px] pt-[10px] bg-[#00FF00]">
          <h2 className="text-xs font-bold tracking-wider">CART</h2>
          <button onClick={onClose} className="hover:opacity-70">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className=" relative">
          {isLoading || loading ? (
            <div className="flex justify-center items-center h-full w-full min-h-screen">
              <CustomLoader />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-4">
              Error fetching cart items
            </p>
          ) : data?.checkout?.lines?.length > 0 ? (
            data.checkout.lines.map((item) => (
              <div key={item.id} className="py-6 border-b border-black">
                <div className="flex gap-4">
                  {item.variant.product.thumbnail?.url && (
                    <img
                      src={
                        item.variant.product.thumbnail.url || "/placeholder.svg"
                      }
                      alt={
                        item.variant.product.thumbnail?.alt || "Product Image"
                      }
                      className="w-24 h-24 object-cover border border-black"
                    />
                  )}
                  <div className="flex-grow">
                    <h3 className="font-bold mb-1 uppercase text-xs">
                      {item.variant.product.name}
                    </h3>
                    <p className="text-xs font-bold mb-2">
                      $ {item.variant.pricing.price.gross.amount.toFixed(2)}
                    </p>
                    <p className="mb-1 uppercase text-xs">
                      Category: {item.variant.product.category?.name || "Black"}
                    </p>
                    <p className="mb-2 text-xs uppercase">
                      Size:{" "}
                      {item.variant.attributes.find(
                        (attr) => attr.attribute.name === "Size"
                      )?.values[0]?.name || "U"}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs uppercase">Quantity:</span>
                      <button
                        className="px-2 hover:opacity-70"
                        onClick={() =>
                          handleQuantityChange(
                            item.variant.id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 hover:opacity-70"
                        onClick={() =>
                          handleQuantityChange(
                            item.variant.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs py-8">YOUR CART IS EMPTY</p>
          )}
        </div>

        {data?.checkout?.totalPrice && (
          <div className="absolute mb-10 sm:mb-0 w-full bottom-0 left-0 px-6 py-4 bg-white border-t border-black">
            <div className="pt-4">
              <h3 className="text-xs font-bold mb-4">
                OUR SIGNATURE PACKAGING
              </h3>

              <div className="flex text-xs justify-between mb-2">
                <span>SHIPPING COST</span>
                <span>$ 0.00</span>
              </div>
              <div className="flex text-xs justify-between mb-4">
                <span>SALES TAX</span>
                <span className="text-xs">CALCULATED AT CHECKOUT</span>
              </div>
              <div className="flex text-xs justify-between mb-6">
                <span>ESTIMATED TOTAL (TAX EXCL.)</span>
                <span>
                  $ {data.checkout.totalPrice.gross.amount.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/checkout"
                  className="w-full py-2 text-xs border border-black text-center hover:bg-black hover:text-white"
                  onClick={onClose}
                >
                  CHECKOUT NOW ({data.checkout.lines.length})
                </Link>
                <Link
                  to="/account?tab=cart"
                  className="w-full py-2 text-xs bg-black text-white text-center hover:bg-white border border-black hover:text-black"
                  onClick={onClose}
                >
                  VIEW CART
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
