import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { REFRESH_TOKEN_MUTATION, GET_CART_ITEMS } from "../graphql/queries";
import CheckoutPayment from "../Components/CheckoutPayment";
import CheckoutShipping from "../Components/CheckoutShipping";
import CustomLoader from "../Components/CustomLoader";
import { GET_USER_QUERY } from "../graphql/queries";
function Checkout() {
  const [activeSection, setActiveSection] = useState("email");
  const [email, setEmail] = useState("");
  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { userLoading, userEmail, userData } = useQuery(GET_USER_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    onCompleted: (data) => {
      if (data?.me?.email) {
        setEmail(data.me.email);
        setActiveSection("shipping");
      }
    },
  });
  // this case is for an expired token of a logged user
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);
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
        setIsProcessing(true);
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
        } finally {
          setIsProcessing(false);
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

  const handlePaymentSuccess = () => {
    window.location.href = "/account?tab=orders";
  };

  if (loading || isProcessing) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-28 p-8">Error loading cart items</div>
    );
  }
  const subtotalAmount = data?.checkout?.subtotalPrice?.gross.amount || 0;
  const shippingAmount = data?.checkout?.shippingPrice?.gross.amount || 0;
  const totalAmount = (subtotalAmount + shippingAmount).toFixed(2);

  const handleShippingMethodUpdate = () => {
    refetch();
  };

  return (
    <div className="min-h-screen mt-28 grid md:grid-cols-[1fr,400px]">
      {/* Main Checkout Form */}
      <main className="p-8 max-w-[800px] mx-auto w-full space-y-4">
        {/* Email Section */}
        <section className="border-b border-black pb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-sm  ">1. EMAIL</h2>
            {activeSection !== "email" && email && (
              <button
                onClick={() => setActiveSection("email")}
                className="text-xs uppercase text-gray-500 hover:text-black"
              >
                EDIT
              </button>
            )}
          </div>

          {activeSection === "email" ? (
            <div className="space-y-4">
              <p className="text-xs uppercase text-gray-600">
                Please enter your email address. If you would like to create an
                account, you will be able to do it later.
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs uppercase">
                  <span className="text-gray-500 text-xs">*required</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-black p-3"
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
            <p className="text-xs text-gray-600">{email}</p>
          )}
        </section>

        {/* Shipping Section */}
        <CheckoutShipping
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleContinue={handleContinue}
          setShippingMethodId={setShippingMethodId}
          setBillingAddress={setBillingAddress}
          onShippingMethodUpdate={handleShippingMethodUpdate}
        />

        {/* Payment Section */}
        <CheckoutPayment
          activeSection={activeSection}
          checkoutId={checkoutId}
          amount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
          userEmail={email}
          shippingMethodId={shippingMethodId}
          billingAddress={billingAddress}
        />
      </main>

      {/* Order Summary Sidebar */}
      <aside className="border-l border-black p-6 bg-white">
        <div className="space-y-6">
          <h2 className="font-medium">ORDER SUMMARY</h2>
          <div className="space-y-4 border-b border-black pb-6">
            {data?.checkout?.lines?.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.variant.product.thumbnail?.url && (
                  <img
                    src={item.variant.product.thumbnail.url}
                    alt={item.variant.product.thumbnail?.alt || "Product Image"}
                    className="w-20 h-20 object-cover border border-black"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.variant.product.name}</h3>
                  <p className="text-xs text-gray-600">
                    Category: {item.variant.product.category?.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-xs text-gray-600">
                    Price: ${item.variant.pricing.price.gross.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-b border-black pb-6">
            <div className="flex justify-between text-xs">
              <span>SUBTOTAL</span>
              <span>
                ${data.checkout.subtotalPrice.gross.amount.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>SHIPPING</span>
              <span>
                $
                {data.checkout.shippingPrice?.gross.amount.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex text-xs justify-between">
              <span>SALES TAX</span>
              <span className="text-xs">CALCULATED AT CHECKOUT</span>
            </div>
            <div className="flex text-xs justify-between font-medium pt-2">
              <span>TOTAL (TAX EXCL.)</span>
              <span>${totalAmount || "0.00"}</span>
            </div>
          </div>

          <ul className="space-y-2 text-xs uppercase">
            <li>Free shipping, returns and exchanges</li>
            <li>30 days free return</li>
            <li>30 days free online exchange</li>
            <li>Signature packaging</li>
          </ul>

          <div className="space-y-4">
            <p className="font-medium text-center text-xs">WE ACCEPT</p>
            <div className="flex justify-center gap-2">
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
                  className="w-10 h-6 object-contain"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="font-medium text-[0.6rem]">
              CUSTOMER SUPPORT <br />
              hello@clothd.co
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Checkout;
