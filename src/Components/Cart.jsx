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
    <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-400 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose}>
      <div className={`fixed top-0 right-0 w-full sm:w-[400px] h-screen bg-white transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-slate-200 px-6 py-2">
          <h2 className="text-black text-sm uppercase">CART</h2>
          <button onClick={onClose} className="text-black hover:opacity-70">
            <RiCloseFill size={24} />
          </button>
        </div>

        <div className="h-[calc(100vh-400px)] overflow-auto px-6 py-4">
          {loading ? <p className="text-black text-xs">Loading...</p> :
          error ? <p className="text-red-500 text-xs">Error fetching cart items</p> :
          data?.checkout?.lines?.length > 0 ? data.checkout.lines.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <p className="text-black text-xs">Item ID: {item.id}</p>
              <p className="text-black text-xs">Qty: {item.quantity}</p>
            </div>
          )) : <p className="text-black text-xs">YOUR CART IS EMPTY</p>}
        </div>
      </div>
    </div>
  );
}

export default Cart;
