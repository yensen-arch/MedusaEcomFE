// src/services/paymentService.js
import { CardElement } from "@stripe/react-stripe-js";

export const handleCardPayment = async (
  stripe,
  elements,
  userEmail,
  billingAddress
) => {
  if (!stripe || !elements) {
    return { error: "Payment system not initialized" };
  }

  const cardElement = elements.getElement(CardElement);
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
    billing_details: {
      name: billingAddress.firstName + " " + billingAddress.lastName,
      email: userEmail,
      phone: billingAddress.phone,
      address: {
        line1: billingAddress.streetAddress1,
        line2: billingAddress.streetAddress2,
        city: billingAddress.city,
        postal_code: billingAddress.postalCode,
        country: billingAddress.country,
      },
    },
  });

  if (error) {
    return { error: `Payment Error: ${error.message}` };
  }

  return { paymentToken: paymentMethod.id };
};

export const handleKlarnaPayment = async (
  stripe,
  checkoutId,
  amount,
  userEmail,
  billingAddress
) => {
  if (!stripe) return { error: "Payment system not initialized" };
  try {
    const query = `
      mutation CheckoutPaymentCreate($checkoutId: ID!, $input: PaymentInput!) {
        checkoutPaymentCreate(checkoutId: $checkoutId, input: $input) {
          payment { token }
          errors { field message }
        }
      }
    `;
    const variables = {
      checkoutId,
      input: {
        gateway: "saleor.payments.stripe",
        amount: Math.round(parseFloat(amount) * 100),
      },
    };
    const res = await fetch("/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const result = await res.json();
    if (
      result.errors ||
      (result.data?.checkoutPaymentCreate?.errors &&
        result.data.checkoutPaymentCreate.errors.length > 0)
    ) {
      const msg =
        result.errors?.[0]?.message ||
        result.data.checkoutPaymentCreate.errors[0].message;
      return { error: `Klarna Error: ${msg}` };
    }
    const token = result.data.checkoutPaymentCreate.payment.token;
    const { client_secret } = JSON.parse(token);
    const { error, paymentIntent } = await stripe.confirmKlarnaPayment(
      client_secret,
      {
        payment_method: {
          billing_details: {
            name: `${billingAddress.firstName} ${billingAddress.lastName}`,
            email: userEmail,
            address: {
              line1: billingAddress.streetAddress1,
              line2: billingAddress.streetAddress2 || "",
              city: billingAddress.city,
              state: billingAddress.countryArea,
              postal_code: billingAddress.postalCode,
              country: billingAddress.country,
            },
          },
        },
        return_url: window.location.href,
      }
    );
    if (error) return { error: `Klarna Error: ${error.message}` };
    if (paymentIntent.status === "requires_action")
      return { status: "pending" };
    return { paymentToken: paymentIntent.id };
  } catch (err) {
    return { error: `Klarna Error: ${err.message}` };
  }
};

export const processPayment = async (
  checkoutPaymentCreate,
  checkoutComplete,
  stripe,
  checkoutId,
  paymentMethodId,
  amount,
  token,
  refreshToken,
  refreshTokenMutation
) => {
  try {
    // Create payment
    const { data: paymentData } = await checkoutPaymentCreate({
      variables: {
        checkoutId,
        input: {
          gateway: "saleor.payments.stripe",
          token: paymentMethodId,
          amount: parseFloat(amount),
        },
      },
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });

    if (paymentData?.checkoutPaymentCreate?.errors?.length) {
      const errorMessage = paymentData.checkoutPaymentCreate.errors
        .map((err) => err.message)
        .join(", ");
      console.error("Payment creation error:", errorMessage);
      return { error: `Payment Creation Error: ${errorMessage}` };
    }

    // Complete checkout
    const { data: completeData } = await checkoutComplete({
      variables: {
        checkoutId,
      },
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });

    if (completeData?.checkoutComplete?.confirmationNeeded) {
      const confirmationData = JSON.parse(
        completeData.checkoutComplete.confirmationData
      );

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        confirmationData.client_secret,
        {
          payment_method: paymentMethodId,
        },
        { handleActions: false }
      );

      if (confirmError) {
        console.error("Payment confirmation error:", confirmError);
        return { error: `Payment confirmation failed: ${confirmError.message}` };
      }

      if (paymentIntent.status === "requires_action") {
        const { error } = await stripe.confirmCardPayment(
          confirmationData.client_secret
        );
        if (error) {
          console.error("Payment authentication error:", error);
          return { error: `Payment authentication failed: ${error.message}` };
        }
      }

      // Retry checkout completion after successful confirmation
      const { data: finalCompleteData } = await checkoutComplete({
        variables: {
          checkoutId,
        },
        context: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      });

      if (finalCompleteData?.checkoutComplete?.errors?.length) {
        const errorMessage = finalCompleteData.checkoutComplete.errors
          .map((err) => err.message)
          .join(", ");
        console.error("Final checkout completion error:", errorMessage);
        return { error: `Checkout Completion Error: ${errorMessage}` };
      }

      if (!finalCompleteData?.checkoutComplete?.order?.id) {
        console.error("No order ID in final response:", finalCompleteData);
        return { error: "Order creation failed - no order ID received" };
      }

      const orderId = finalCompleteData.checkoutComplete.order.id;
      console.log("Order created successfully:", finalCompleteData.checkoutComplete.order);
      
      // Force a cache reset for the orders query
      return { 
        success: true, 
        orderId,
        shouldRefetchOrders: true 
      };
    }

    if (completeData?.checkoutComplete?.errors?.length) {
      const errorMessage = completeData.checkoutComplete.errors
        .map((err) => err.message)
        .join(", ");
      console.error("Checkout completion error:", errorMessage);
      return { error: `Checkout Completion Error: ${errorMessage}` };
    }

    if (!completeData?.checkoutComplete?.order?.id) {
      console.error("No order ID in response:", completeData);
      return { error: "Order creation failed - no order ID received" };
    }

    // Verify the order is associated with the user
    const orderId = completeData.checkoutComplete.order.id;
    console.log("Order created successfully:", completeData.checkoutComplete.order);
    
    // Force a cache reset for the orders query
    return { 
      success: true, 
      orderId,
      shouldRefetchOrders: true 
    };
  } catch (err) {
    console.error("Payment processing error:", err);
    return { error: err.message || "Payment processing failed" };
  }
};
