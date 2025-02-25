// src/components/checkout/CheckoutForm.js
import React, { useEffect, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import {
  CHECKOUT_PAYMENT_CREATE,
  CHECKOUT_EMAIL_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE,
  CHECKOUT_COMPLETE,
} from "../../graphql/queries";
import PaymentMethodSelector from "./PaymentMethodSelector";
import {
  handleCardPayment,
  handleKlarnaPayment,
  processPayment,
} from "./paymentService";
import usePaymentRequest from "./PaymentRequestSetup";

const CheckoutForm = ({
  onSuccess,
  checkoutId,
  amount,
  userEmail,
  shippingMethodId,
  billingAddress,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const [checkoutPaymentCreate] = useMutation(CHECKOUT_PAYMENT_CREATE);
  const [checkoutEmailUpdate] = useMutation(CHECKOUT_EMAIL_UPDATE);
  const [updateBillingAddress] = useMutation(CHECKOUT_BILLING_ADDRESS_UPDATE);
  const [checkoutComplete] = useMutation(CHECKOUT_COMPLETE);

  const { paymentRequest, canMakePayment } = usePaymentRequest(
    stripe,
    amount,
    checkoutId,
    checkoutPaymentCreate,
    checkoutEmailUpdate,
    checkoutComplete,
    userEmail,
    setIsProcessing,
    setError,
    onSuccess
  );

  useEffect(() => {
    const updateBilling = async () => {
      try {
        const { data } = await updateBillingAddress({
          variables: {
            checkoutId,
            billingAddress: {
              firstName: billingAddress.firstName,
              lastName: billingAddress.lastName,
              streetAddress1: billingAddress.streetAddress1,
              streetAddress2: billingAddress.streetAddress2 || "",
              city: billingAddress.city,
              postalCode: billingAddress.postalCode,
              country: billingAddress.country,
              countryArea: billingAddress.countryArea,
              phone: billingAddress.phone,
            },
          },
        });

        if (data?.checkoutBillingAddressUpdate?.errors?.length) {
          const errorMessage = data.checkoutBillingAddressUpdate.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          setError(`Billing Address Error: ${errorMessage}`);
        }
      } catch (err) {
        setError(`Failed to update billing address: ${err.message}`);
      }
    };

    if (checkoutId && billingAddress) {
      updateBilling();
    }
  }, [checkoutId, billingAddress, updateBillingAddress]);

  const handleEmailUpdate = async () => {
    const { data } = await checkoutEmailUpdate({
      variables: {
        checkoutId,
        email: userEmail,
      },
    });

    if (data?.checkoutEmailUpdate?.errors?.length) {
      const errorMessage = data.checkoutEmailUpdate.errors
        .map((err) => err.message)
        .join(", ");
      setError(`Email Update Error: ${errorMessage}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsProcessing(true);

    const emailUpdated = await handleEmailUpdate();
    if (!emailUpdated) {
      setIsProcessing(false);
      return;
    }

    let paymentResult;

    if (paymentMethod === "card") {
      paymentResult = await handleCardPayment(
        stripe,
        elements,
        userEmail,
        billingAddress
      );
    } else if (paymentMethod === "klarna") {
      paymentResult = await handleKlarnaPayment(
        stripe,
        checkoutId,
        amount,
        userEmail,
        billingAddress
      );
      if (paymentResult.status === "pending") {
        // For Klarna redirect flow
        setIsProcessing(false);
        return;
      }
    }

    if (paymentResult.error) {
      setError(paymentResult.error);
      setIsProcessing(false);
      return;
    }

    const processResult = await processPayment(
      checkoutPaymentCreate,
      checkoutComplete,
      stripe,
      checkoutId,
      paymentResult.paymentToken,
      amount
    );

    if (processResult.success) {
      localStorage.removeItem("checkoutId");
      localStorage.removeItem("cartCount");
      onSuccess();
    } else {
      setError(processResult.error);
      setIsProcessing(false);
    }
  };

  const paymentOptions = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
    },
  ];

  if (canMakePayment) {
    if (canMakePayment.applePay) {
      paymentOptions.push({
        id: "apple-pay",
        name: "Apple Pay",
        icon: "🍎",
      });
    }

    if (canMakePayment.googlePay) {
      paymentOptions.push({
        id: "google-pay",
        name: "Google Pay",
        icon: "G",
      });
    }
  }

  paymentOptions.push({
    id: "klarna",
    name: "Klarna",
    icon: "K",
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <PaymentMethodSelector
        options={paymentOptions}
        selected={paymentMethod}
        onChange={setPaymentMethod}
      />

      {paymentMethod === "card" && (
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          <button
            type="submit"
            className="w-full bg-black text-xs text-white py-3 mt-4 hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
          </button>
        </form>
      )}

      {paymentMethod === "apple-pay" || paymentMethod === "google-pay" ? (
        <div className="mt-4">
          {paymentRequest && (
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: "default",
                    theme: "dark",
                    height: "48px",
                  },
                },
              }}
            />
          )}
        </div>
      ) : null}

      {paymentMethod === "klarna" && (
        <form onSubmit={handleSubmit}>
          <p className="text-sm mb-3">
            Pay later with Klarna. You'll be redirected to complete your
            purchase.
          </p>
          <button
            type="submit"
            className="w-full bg-black text-xs border border-black text-white py-3 mt-2 hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            {isProcessing ? "PROCESSING..." : "PAY WITH KLARNA"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
