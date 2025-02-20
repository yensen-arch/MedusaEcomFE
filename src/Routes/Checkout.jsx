import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  REFRESH_TOKEN_MUTATION,
  GET_CART_ITEMS,
} from "../graphql/queries";
import CheckoutPayment from "../Components/CheckoutPayment";
import CheckoutShipping from "../Components/CheckoutShipping";

function Checkout() {
  const [activeSection, setActiveSection] = useState("email");
  const [email, setEmail] = useState("");
  const [shippingMethodId, setShippingMethodId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

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
            refetch();
          } else {
            console.error("Token refresh failed.");
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
        }
      }
    },
  });

  const handleContinue = (section) => {
    if (section === "email" && email) {
      setActiveSection("shipping");
    } else if (section === "shipping") {
      setActiveSection("payment");
    }
  };

  if (loading) return <div className="min-h-screen mt-28 p-8">Loading...</div>;
  if (error)
    return (
      <div className="min-h-screen mt-28 p-8">Error loading cart items</div>
    );
const totalAmount=data?.checkout?.totalPrice?.gross.amount.toFixed(2)
  return (
    <div className="min-h-screen mt-28 grid md:grid-cols-[1fr,400px]">
      {/* Main Checkout Form */}
      <main className="p-8 max-w-[800px] mx-auto w-full space-y-4">
        {/* Email Section */}
        <section className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-medium">1. EMAIL</h2>
            {activeSection !== "email" && email && (
              <button
                onClick={() => setActiveSection("email")}
                className="text-sm text-gray-500 hover:text-black"
              >
                Edit
              </button>
            )}
          </div>

          {activeSection === "email" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please enter your email address to log in or checkout as guest.
                If you would like to create an account, you will be able to do
                it later.
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <label htmlFor="email">
                    Email Address (for order updates)
                  </label>
                  <span className="text-gray-500">*required</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-3"
                  required
                />
              </div>
              <button
                onClick={() => handleContinue("email")}
                className="w-full bg-black text-white py-3 hover:bg-black/90"
              >
                CONTINUE
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{email}</p>
          )}
        </section>

        {/* Shipping Section */}
        <CheckoutShipping
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleContinue={handleContinue}
          setShippingMethodId={setShippingMethodId}
        />

        {/* Payment Section */}
        <CheckoutPayment activeSection={activeSection} checkoutId={checkoutId} amount={totalAmount} userEmail={email} shippingMethodId={shippingMethodId} />
      </main>

      {/* Order Summary Sidebar */}
      <aside className="border-l border-gray-200 p-6 bg-white">
        <div className="space-y-6">
          <h2 className="font-medium">ORDER SUMMARY</h2>
          <div className="space-y-4 border-b border-gray-200 pb-6">
            {data?.checkout?.lines?.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.variant.product.thumbnail?.url && (
                  <img
                    src={item.variant.product.thumbnail.url}
                    alt={item.variant.product.thumbnail?.alt || "Product Image"}
                    className="w-20 h-20 object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.variant.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Category: {item.variant.product.category?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${item.variant.pricing.price.gross.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-b border-gray-200 pb-6">
            <div className="flex justify-between">
              <span>SUBTOTAL</span>
              <span>
                $
                {data?.checkout?.subtotalPrice?.gross.amount.toFixed(2) ||
                  "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>SHIPPING</span>
              <span>$ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>SALES TAX</span>
              <span className="text-sm">CALCULATED AT CHECKOUT</span>
            </div>
            <div className="flex justify-between font-medium pt-2">
              <span>TOTAL (TAX EXCL.)</span>
              <span>
                ${totalAmount || "0.00"}
              </span>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li>Free shipping, returns and exchanges</li>
            <li>30 days free return</li>
            <li>30 days free online exchange</li>
            <li>Signature packaging</li>
          </ul>

          <div className="space-y-4">
            <p className="font-medium text-center">WE ACCEPT</p>
            <div className="flex justify-center gap-2">
              {[
                "visa",
                "mastercard",
                "amex",
                "paypal",
                "klarna",
                "bitpay",
                "apple-pay",
              ].map((payment) => (
                <div key={payment} className="w-10 h-6 bg-black rounded" />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="font-medium">CUSTOMER SUPPORT</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Checkout;
