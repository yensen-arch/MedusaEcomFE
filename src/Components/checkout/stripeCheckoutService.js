import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QtM2fAotN9X1sy17CBqLAFeybXj9BbKu1wKY8IQhY5PcAwy4kQNM23XYcTinaTASJIJNEpzd82seY8sEMpSzk8b00pTVhX3Qp"
);

export const createCheckoutSession = async (
  checkoutId,
  amount,
  userEmail,
  billingAddress,
  token
) => {
  try {
    const query = `
      mutation CheckoutPaymentCreate($checkoutId: ID!, $input: PaymentInput!) {
        checkoutPaymentCreate(checkoutId: $checkoutId, input: $input) {
          payment {
            id
            chargeStatus
            token
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      checkoutId,
      input: {
        gateway: "saleor.payments.stripe",
        amount: parseFloat(amount),
      },
    };

    const response = await fetch("/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors || result.data?.checkoutPaymentCreate?.errors?.length) {
      const errorMessage = result.errors?.[0]?.message || 
        result.data.checkoutPaymentCreate.errors[0].message;
      throw new Error(errorMessage);
    }

    const paymentToken = result.data.checkoutPaymentCreate.payment.token;
    
    if (!paymentToken) {
      throw new Error("Payment token is empty. Please try again.");
    }

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: paymentToken,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Checkout error:", error);
    return { error: error.message };
  }
};

export default stripePromise; 