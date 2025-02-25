// src/components/checkout/CheckoutPayment.js
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "./StripeProvider";
import CheckoutForm from "./CheckoutForm";

const CheckoutPayment = ({
  activeSection,
  onPaymentSuccess,
  checkoutId,
  amount,
  userEmail,
  shippingMethodId,
  billingAddress,
}) => {
  return (
    <section className="border-b border-black pb-6">
      <h2
        className={
          activeSection === "payment" ? "font-medium" : "text-gray-400"
        }
      >
        3. PAYMENT
      </h2>
      {activeSection === "payment" && (
        <div className="mt-4 space-y-4">
          <Elements stripe={stripePromise}>
            <CheckoutForm
              onSuccess={onPaymentSuccess}
              checkoutId={checkoutId}
              amount={amount}
              userEmail={userEmail}
              shippingMethodId={shippingMethodId}
              billingAddress={billingAddress}
            />
          </Elements>
        </div>
      )}
    </section>
  );
};

export default CheckoutPayment;