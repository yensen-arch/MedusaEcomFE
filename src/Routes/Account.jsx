import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Footer from "../Components/Footer";
import {
  REFRESH_TOKEN_MUTATION,
  GET_USER_QUERY,
  GET_CART_ITEMS,
} from "../graphql/queries";
import { Link } from "react-router-dom";
import CustomLoader from "../Components/CustomLoader";
const Account = () => {
  const [activeTab, setActiveTab] = useState(
    () => new URLSearchParams(window.location.search).get("tab") || "orders"
  );
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  // Get stored tokens
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const csrfToken = localStorage.getItem("csrfToken");

  // Mutation for refreshing token
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  // Query for user data with error handling
  const { loading, error, data, refetch } = useQuery(GET_USER_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    onCompleted: (data) => {
      if (data.me === null) {
        setIsAuthenticated(false);
        // Clear stored tokens as they're invalid
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    },
    onError: async (error) => {
      if (error.message.includes("Signature has expired")) {
        try {
          const { data: refreshData } = await refreshTokenMutation({
            variables: { refreshToken },
          });

          if (refreshData?.tokenRefresh?.token) {
            localStorage.setItem("token", refreshData.tokenRefresh.token);
            refetch();
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    },
  });
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  // Query for cart items
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART_ITEMS, {
    variables: { checkoutId },
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    skip: !checkoutId,
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
      window.location.href = "/login";
      return;
    }

    if (data?.me) {
      setUserData(data.me);
      setIsAuthenticated(true);
    }
  }, [data, accessToken, refreshToken]);

  if (!isAuthenticated) {
    return null; // or a loading state while redirecting
  }
  return (
    <>
      <div className="h-screen mt-4 flex flex-col items-center px-4 border border-black">
        <div className="w-full max-w-[600px] h-screen mt-16 space-y-12 border border-black border-y">
          <div className="text-center space-y-8">
            <h1 className="text-xs py-2">{userData?.email}</h1>

            <div className="flex justify-center border-y border-black">
              <nav className="flex items-center">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-3 text-xs hover:bg-slate-100 ${
                    activeTab === "orders" ? "bg-slate-200" : ""
                  }`}
                >
                  ORDERS
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`px-4 py-3 text-xs hover:bg-slate-100 ${
                    activeTab === "account" ? "bg-slate-200" : ""
                  }`}
                >
                  ACCOUNT
                </button>
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`px-4 py-3 text-xs hover:bg-slate-100 ${
                    activeTab === "cart" ? "bg-slate-300" : ""
                  }`}
                >
                  CART
                </button>
              </nav>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-80">
              <CustomLoader />
            </div>
          ) : error && !error.message.includes("Signature has expired") ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-xs text-red-500 uppercase">
                Error loading account data
              </p>
            </div>
          ) : activeTab === "orders" ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-6">
              <h2 className="text-sm">NO ORDERS YET</h2>
              <button className="border text-sm text-white bg-black border-black py-3 px-6 hover:bg-white hover:text-black transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : activeTab === "account" ? (
            <div className="space-y-12">
              <section className="space-y-6">
                <h2 className="text-center text-sm">PERSONAL INFO</h2>
                <div className="space-y-6 text-center">
                  <div className="space-y-1 px-2">
                    <p className="text-xs text-black">
                      Email: {userData?.email}
                    </p>
                  </div>
                </div>
              </section>
              <section className="space-y-6">
                <div className="space-y-6">
                  <button className="w-full border text-white bg-black text-sm border-black py-3 hover:bg-white hover:text-black transition-colors">
                    CHANGE PASSWORD
                  </button>
                </div>
              </section>
            </div>
          ) : activeTab === "cart" ? (
            <div className="space-y-4 p-4">
              <h2 className="text-sm text-center">YOUR CART</h2>
              {cartLoading ? (
                <p className="text-sm text-center">
                  <CustomLoader />
                </p>
              ) : cartError ? (
                <p className="text-xs uppercase text-center text-red-500">
                  Error loading cart
                </p>
              ) : cartData?.checkout?.lines?.length > 0 ? (
                <ul className="space-y-4">
                  {cartData.checkout.lines.map((item) => (
                    <li key={item.id} className="text-sm border-b pb-2">
                      <div className="flex justify-between items-center">
                        <img
                          src={item.variant.product.thumbnail.url}
                          alt={
                            item.variant.product.thumbnail.alt ||
                            "Product Image"
                          }
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <p className="font-medium">
                            {item.variant.product.name}
                          </p>
                          <p className="text-gray-600 text-xs uppercase">
                            Category: {item.variant.product.category.name}
                          </p>
                          <p className="text-gray-600 text-xs uppercase">
                            Size: {item.variant.name}
                          </p>
                          <p className="text-gray-600 text-xs uppercase">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>
                            {item.variant.pricing.price.gross.currency} $
                            {item.variant.pricing.price.gross.amount}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium flex justify-between">
                      <span>Total:</span>
                      <span>
                        {cartData.checkout.totalPrice.gross.currency} $
                        {cartData.checkout.totalPrice.gross.amount}
                      </span>
                    </p>
                  </div>
                </ul>
              ) : (
                <p className="text-xs text-center">NO ITEMS IN CART</p>
              )}
              <Link
                to="/checkout"
                className="block text-center bg-black text-white py-2 rounded"
              >
                Checkout
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
