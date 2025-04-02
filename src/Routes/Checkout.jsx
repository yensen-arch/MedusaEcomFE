import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { REFRESH_TOKEN_MUTATION, GET_CART_ITEMS, CHECKOUT_ADD_PROMO_CODE } from "../graphql/queries";
import CheckoutPayment from "../Components/checkout/CheckoutPayment";
import CheckoutShipping from "../Components/CheckoutShipping";
import CustomLoader from "../Components/CustomLoader";
import { GET_USER_QUERY } from "../graphql/queries";

function Checkout() {
  const [activeSection, setActiveSection] = useState("email");
  const [email, setEmail] = useState("");
  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [originalPrices, setOriginalPrices] = useState({
    subtotal: null,
    total: null,
    items: {}
  });

  // Get user data
  const { loading: userLoading, data: userData } = useQuery(GET_USER_QUERY, {
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

  // Handle token management
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  // Get cart items
  const {
    data: cartData,
    loading: cartLoading,
    error,
    refetch,
  } = useQuery(GET_CART_ITEMS, {
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
      } else if (error.message.includes("Signature verification failed")) {
        // Handle invalid token directly - refreshing won't help in this case
        console.error("Invalid token detected:", error.message);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } else {
        // Handle other errors
        console.error("GraphQL error:", error.message);
      }
    },
  });

  const [applyDiscountCode] = useMutation(CHECKOUT_ADD_PROMO_CODE);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError("Please enter a voucher code");
      return;
    }

    // Store original prices before applying voucher
    setOriginalPrices({
      subtotal: cartData.checkout.subtotalPrice.gross.amount,
      total: cartData.checkout.totalPrice.gross.amount,
      items: cartData.checkout.lines.reduce((acc, item) => ({
        ...acc,
        [item.id]: item.variant.pricing.price.gross.amount
      }), {})
    });

    setIsApplyingVoucher(true);
    setVoucherError("");

    try {
      const { data } = await applyDiscountCode({
        variables: {
          checkoutId,
          promoCode: voucherCode.trim()
        },
      });

      if (data?.checkoutAddPromoCode?.errors?.length) {
        setVoucherError(data.checkoutAddPromoCode.errors[0].message);
        // Reset original prices if voucher application failed
        setOriginalPrices({
          subtotal: null,
          total: null,
          items: {}
        });
      } else {
        // Refresh the cart data to show updated prices
        refetch();
        setVoucherError("");
        setIsVoucherApplied(true);
      }
    } catch (error) {
      setVoucherError("Failed to apply voucher code");
      // Reset original prices if voucher application failed
      setOriginalPrices({
        subtotal: null,
        total: null,
        items: {}
      });
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  // Set initialized state when all initial data is loaded
  useEffect(() => {
    if (!userLoading && !cartLoading && !isProcessing) {
      setIsInitialized(true);
    }
  }, [userLoading, cartLoading, isProcessing]);

  // Check if any API is still loading
  const isLoading = !isInitialized || userLoading || cartLoading || isProcessing;

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

  const handleShippingMethodUpdate = () => {
    refetch();
  };

  // Show loader when any API is loading
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  }

  // Show error state if cart loading fails
  if (error) {
    return (
      <div className="min-h-screen mt-28 p-8">Error loading cart items</div>
    );
  }

  // Calculate totals from data
  const subtotalAmount = cartData?.checkout?.subtotalPrice?.gross.amount || 0;
  const shippingAmount = cartData?.checkout?.shippingPrice?.gross.amount || 0;
  const totalAmount = (subtotalAmount + shippingAmount).toFixed(2);

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
          
          {/* Voucher Code Section */}
          <div className="space-y-2 border-b border-black pb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER AMBASSADOR CODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                disabled={isVoucherApplied}
                className="flex-1 border border-black p-2 text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={isApplyingVoucher || isVoucherApplied}
                className="bg-black text-white px-4 py-2 text-xs hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isApplyingVoucher ? "APPLYING..." : isVoucherApplied ? "APPLIED" : "APPLY"}
              </button>
            </div>
            {voucherError && (
              <p className="text-xs text-red-600">{voucherError}</p>
            )}
            {isVoucherApplied && (
              <p className="text-xs text-green-600">You've got an AMBASSADOR!</p>
            )}
          </div>

          <div className="space-y-4 border-b border-black pb-6">
            {cartData?.checkout?.lines?.map((item) => (
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
                  <div className="text-xs text-gray-600">
                    Price: 
                    <span>${item.variant.pricing.price.gross.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-b border-black pb-6">
            <div className="flex justify-between text-xs">
              <span>SUBTOTAL</span>
              <div className="flex flex-col items-end">
                {isVoucherApplied && originalPrices.subtotal && (
                  <span className="text-gray-400 line-through">
                    ${originalPrices.subtotal.toFixed(2)}
                  </span>
                )}
                <span>
                  ${cartData.checkout.subtotalPrice.gross.amount.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
            {isVoucherApplied && (
              <div className="flex justify-between text-xs text-green-600">
                <span>AMBASSADOR DISCOUNT</span>
                <span>-${(originalPrices.subtotal - cartData.checkout.subtotalPrice.gross.amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>SHIPPING</span>
              <span>
                ${cartData.checkout.shippingPrice?.gross.amount.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex text-xs justify-between">
              <span>SALES TAX</span>
              <span className="text-xs">CALCULATED AT CHECKOUT</span>
            </div>
            <div className="flex text-xs justify-between font-medium pt-2">
              <span>TOTAL (TAX EXCL.)</span>
              <div className="flex flex-col items-end">
                {isVoucherApplied && originalPrices.total && (
                  <span className="text-gray-400 line-through">
                    ${originalPrices.total.toFixed(2)}
                  </span>
                )}
                <span>${cartData.checkout.totalPrice.gross.amount.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-xs uppercase">
            {/* <li>Free shipping, returns and exchanges</li>
            <li>30 days free return</li>
            <li>30 days free online exchange</li> */}
            <li>Handmade in Spain</li>
            <li>Signature packaging</li>
          </ul>

          {/* <div className="space-y-4">
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
          </div> */}

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
