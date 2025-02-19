"use client";
import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART_ITEMS, REFRESH_TOKEN_MUTATION } from "../graphql/queries";

function Cart({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const checkoutId = typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  // Token refresh mutation
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  // Fetch cart items
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
          const { data: refreshData } = await refreshTokenMutation({
            variables: { refreshToken },
          });

          if (refreshData?.tokenRefresh?.token) {
            localStorage.setItem("token", refreshData.tokenRefresh.token);
            refetch(); // Retry fetching cart items
          } else {
            console.error("Token refresh failed.");
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
        }
      }
    },
  });

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="fixed top-0 right-0 w-full sm:w-[400px] h-screen bg-white" onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>CART</h2>
          <button onClick={onClose}>
            <RiCloseFill size={24} />
          </button>
        </div>

        <div>
          {loading ? <p>Loading...</p> :
          error ? <p>Error fetching cart items</p> :
          data?.checkout?.lines?.length > 0 ? data.checkout.lines.map((item) => (
            <div key={item.id}>
              {item.variant.product.thumbnail?.url && (
                <img src={item.variant.product.thumbnail.url} alt={item.variant.product.thumbnail?.alt || "Product Image"} width="50" />
              )}
              <p>{item.variant.product.name}</p>
              <p>Category: {item.variant.product.category?.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ${item.variant.pricing.price.gross.amount.toFixed(2)}</p>
            </div>
          )) : <p>YOUR CART IS EMPTY</p>}
        </div>

        {/* Checkout Summary */}
        {data?.checkout?.totalPrice && (
          <div>
            <p>Total: ${data.checkout.totalPrice.gross.amount.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
