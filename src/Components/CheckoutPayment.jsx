import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CHECKOUT_PAYMENT_CREATE,
  CHECKOUT_EMAIL_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE,
  SHIPPING_METHOD_UPDATE,
} from "../graphql/queries";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51QtM2fAotN9X1sy17CBqLAFeybXj9BbKu1wKY8IQhY5PcAwy4kQNM23XYcTinaTASJIJNEpzd82seY8sEMpSzk8b00pTVhX3Qp"
);

const CheckoutForm = ({
  onSuccess,
  checkoutId,
  amount,
  userEmail,
  shippingMethodId,
  billingAddress,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [checkoutPaymentCreate, { loading }] = useMutation(
    CHECKOUT_PAYMENT_CREATE
  );
  const [checkoutEmailUpdate] = useMutation(CHECKOUT_EMAIL_UPDATE);
  const [checkoutShippingMethodUpdate] = useMutation(SHIPPING_METHOD_UPDATE);
  const [updateBillingAddress] = useMutation(CHECKOUT_BILLING_ADDRESS_UPDATE);

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

  const handleShippingUpdate = async () => {
    const { data } = await checkoutShippingMethodUpdate({
      variables: {
        checkoutId,
        shippingMethodId: shippingMethodId,
      },
    });

    if (data?.checkoutShippingMethodUpdate?.errors.length) {
      const errorMessage = data.checkoutShippingMethodUpdate.errors
        .map((err) => err.message)
        .join(", ");
      setError(`Shipping Method Error: ${errorMessage}`);
      return false;
    }
    return true;
  };

  const handleEmailUpdate = async () => {
    const { data } = await checkoutEmailUpdate({
      variables: {
        checkoutId,
        email: userEmail,
      },
    });

    if (data?.checkoutEmailUpdate?.errors.length) {
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

    if (!stripe || !elements) {
      setError("Payment system not initialized");
      return;
    }

    const emailUpdated = await handleEmailUpdate();
    if (!emailUpdated) return;

    const shippingUpdated = await handleShippingUpdate();
    if (!shippingUpdated) return;

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
      setError(`Payment Error: ${error.message}`);
      return;
    }

    try {
      const { data } = await checkoutPaymentCreate({
        variables: {
          checkoutId,
          input: {
            gateway: "saleor.payments.stripe",
            token: paymentMethod.id,
            amount: parseFloat(amount),
          },
        },
      });

      if (data?.checkoutPaymentCreate?.errors.length) {
        const errorMessage = data.checkoutPaymentCreate.errors
          .map((err) => err.message)
          .join(", ");
        setError(`Payment Creation Error: ${errorMessage}`);
        return;
      }

      onSuccess();
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
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
          className="w-full bg-black text-white py-3 mt-4 hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "PLACE ORDER"}
        </button>
      </form>
    </div>
  );
};

export default function CheckoutPayment({
  activeSection,
  onPaymentSuccess,
  checkoutId,
  amount,
  userEmail,
  shippingMethodId,
  billingAddress,
}) {
  return (
    <section className="border-b border-gray-200 pb-6">
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
}
