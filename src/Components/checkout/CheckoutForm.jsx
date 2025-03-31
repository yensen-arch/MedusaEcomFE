// src/components/checkout/CheckoutForm.js
import React, { useEffect, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import {
  CHECKOUT_PAYMENT_CREATE,
  CHECKOUT_EMAIL_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE,
  CHECKOUT_COMPLETE,
  REFRESH_TOKEN_MUTATION,
} from "../../graphql/queries";
import PaymentMethodSelector from "./PaymentMethodSelector";
import {
  handleCardPayment,
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
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Update email if not already set
      if (userEmail && !paymentRequest?.data?.checkout?.email) {
        await checkoutEmailUpdate({
          variables: {
            checkoutId,
            email: userEmail,
          },
          context: {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        });
      }

      // Update billing address
      await updateBillingAddress({
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
            phone: billingAddress.phone || "",
          },
        },
        context: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      });

      // Create payment method
      const cardElement = elements.getElement(CardElement);
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${billingAddress.firstName} ${billingAddress.lastName}`,
          email: userEmail,
          phone: billingAddress.phone,
          address: {
            line1: billingAddress.streetAddress1,
            line2: billingAddress.streetAddress2 || "",
            city: billingAddress.city,
            postal_code: billingAddress.postalCode,
            country: billingAddress.country,
          },
        },
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setIsProcessing(false);
        return;
      }

      // Process payment
      const result = await processPayment(
        checkoutPaymentCreate,
        checkoutComplete,
        stripe,
        checkoutId,
        paymentMethod.id,
        amount,
        token,
        refreshToken,
        refreshTokenMutation
      );

      if (result.error) {
        setError(result.error);
        setIsProcessing(false);
        return;
      }

      // Set the refetch flag if payment was successful
      if (result.success) {
        localStorage.setItem("shouldRefetchOrders", "true");
      }

      // Clear cart data from localStorage
      localStorage.removeItem("cartCount");
      localStorage.removeItem("checkoutId");

      // Call the success callback
      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
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
    </div>
  );
};

export default CheckoutForm;
