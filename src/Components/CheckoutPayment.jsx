import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import {
  CHECKOUT_PAYMENT_CREATE,
  CHECKOUT_EMAIL_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE,
  CHECKOUT_COMPLETE,
} from "../graphql/queries";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import PaymentMethodSelector from "./PaymentMethodSelector";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");

  const [checkoutPaymentCreate] = useMutation(CHECKOUT_PAYMENT_CREATE);
  const [checkoutEmailUpdate] = useMutation(CHECKOUT_EMAIL_UPDATE);
  const [updateBillingAddress] = useMutation(CHECKOUT_BILLING_ADDRESS_UPDATE);
  const [checkoutComplete] = useMutation(CHECKOUT_COMPLETE);

  // Set up Payment Request for Apple Pay / Google Pay
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Order Total",
          amount: parseFloat(amount) * 100, // Amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: false,
      });

      pr.on("paymentmethod", async (event) => {
        setIsProcessing(true);

        try {
          await handleEmailUpdate();

          const { data: createData } = await checkoutPaymentCreate({
            variables: {
              checkoutId,
              input: {
                gateway: "saleor.payments.stripe",
                token: event.paymentMethod.id,
                amount: parseFloat(amount),
              },
            },
          });

          if (createData?.checkoutPaymentCreate?.errors?.length) {
            const errorMessage = createData.checkoutPaymentCreate.errors
              .map((err) => err.message)
              .join(", ");
            setError(`Payment Creation Error: ${errorMessage}`);
            event.complete("fail");
            setIsProcessing(false);
            return;
          }

          const { data: completeData } = await checkoutComplete({
            variables: {
              checkoutId,
            },
          });

          if (completeData?.checkoutComplete?.confirmationNeeded) {
            const confirmationData = JSON.parse(
              completeData.checkoutComplete.confirmationData
            );

            const { error: confirmError, paymentIntent } =
              await stripe.confirmCardPayment(
                confirmationData.client_secret,
                {
                  payment_method: event.paymentMethod.id,
                },
                { handleActions: false }
              );

            if (confirmError) {
              setError(`Payment confirmation failed: ${confirmError.message}`);
              event.complete("fail");
              setIsProcessing(false);
              return;
            }

            if (paymentIntent.status === "requires_action") {
              // Use the same mechanism as confirmCardPayment to handle 3D Secure authentication
              const { error } = await stripe.confirmCardPayment(
                confirmationData.client_secret
              );
              if (error) {
                setError(`Payment authentication failed: ${error.message}`);
                event.complete("fail");
                setIsProcessing(false);
                return;
              }
            }
          }

          if (completeData?.checkoutComplete?.errors?.length) {
            const errorMessage = completeData.checkoutComplete.errors
              .map((err) => err.message)
              .join(", ");
            setError(`Checkout Completion Error: ${errorMessage}`);
            event.complete("fail");
            setIsProcessing(false);
            return;
          }

          event.complete("success");
          localStorage.removeItem("checkoutId");
          localStorage.removeItem("cartCount");
          onSuccess();
        } catch (err) {
          setError(`Payment failed: ${err.message}`);
          event.complete("fail");
          setIsProcessing(false);
        }
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setCanMakePayment(true);
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, amount, checkoutId]);

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

  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      setError("Payment system not initialized");
      return false;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
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
      return false;
    }

    return pm.id;
  };

  const handleKlarnaPayment = async () => {
    if (!stripe) {
      setError("Payment system not initialized");
      return false;
    }

    // Create a source for Klarna
    const { source, error } = await stripe.createSource({
      type: "klarna",
      flow: "redirect",
      redirect: {
        return_url: window.location.href,
      },
      source_order: {
        items: [
          {
            type: "sku",
            description: "Order payment",
            amount: Math.round(parseFloat(amount) * 100),
            currency: "usd",
            quantity: 1,
          },
        ],
      },
      klarna: {
        product: "payment",
        purchase_country: billingAddress.country,
        first_name: billingAddress.firstName,
        last_name: billingAddress.lastName,
        billing_address: {
          line1: billingAddress.streetAddress1,
          line2: billingAddress.streetAddress2 || "",
          city: billingAddress.city,
          state: billingAddress.countryArea,
          postal_code: billingAddress.postalCode,
          country: billingAddress.country,
        },
      },
    });

    if (error) {
      setError(`Klarna Error: ${error.message}`);
      return false;
    }

    // For Klarna redirect flow
    if (source.redirect.url) {
      window.location.href = source.redirect.url;
      return "pending";
    }

    return source.id;
  };

  const processPayment = async (paymentToken) => {
    try {
      const { data: createData } = await checkoutPaymentCreate({
        variables: {
          checkoutId,
          input: {
            gateway: "saleor.payments.stripe",
            token: paymentToken,
            amount: parseFloat(amount),
          },
        },
      });

      if (createData?.checkoutPaymentCreate?.errors?.length) {
        const errorMessage = createData.checkoutPaymentCreate.errors
          .map((err) => err.message)
          .join(", ");
        setError(`Payment Creation Error: ${errorMessage}`);
        return false;
      }

      const { data: completeData } = await checkoutComplete({
        variables: {
          checkoutId,
        },
      });

      if (completeData?.checkoutComplete?.confirmationNeeded) {
        const confirmationData = JSON.parse(
          completeData.checkoutComplete.confirmationData
        );

        const { error: confirmError } = await stripe.confirmCardPayment(
          confirmationData.client_secret,
          {
            payment_method: paymentToken,
          }
        );

        if (confirmError) {
          setError(`Payment confirmation failed: ${confirmError.message}`);
          return false;
        }
      }

      if (completeData?.checkoutComplete?.errors?.length) {
        const errorMessage = completeData.checkoutComplete.errors
          .map((err) => err.message)
          .join(", ");
        setError(`Checkout Completion Error: ${errorMessage}`);
        return false;
      }

      return true;
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      return false;
    }
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

    let paymentToken;

    if (paymentMethod === "card") {
      paymentToken = await handleCardPayment();
    } else if (paymentMethod === "klarna") {
      paymentToken = await handleKlarnaPayment();
      if (paymentToken === "pending") {
        // For Klarna redirect flow
        setIsProcessing(false);
        return;
      }
    }

    if (!paymentToken) {
      setIsProcessing(false);
      return;
    }

    const success = await processPayment(paymentToken);

    if (success) {
      localStorage.removeItem("checkoutId");
      localStorage.removeItem("cartCount");
      onSuccess();
    } else {
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
            className="w-full bg-pink-500 text-xs text-white py-3 mt-2 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            {isProcessing ? "PROCESSING..." : "PAY WITH KLARNA"}
          </button>
        </form>
      )}
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
}
