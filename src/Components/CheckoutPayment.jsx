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
  SHIPPING_METHOD_UPDATE,
} from "../graphql/queries";
import { useMutation } from "@apollo/client";

const stripePromise = loadStripe(
  "pk_test_51QtM2fAotN9X1sy17CBqLAFeybXj9BbKu1wKY8IQhY5PcAwy4kQNM23XYcTinaTASJIJNEpzd82seY8sEMpSzk8b00pTVhX3Qp"
);

const CheckoutForm = ({ onSuccess, checkoutId, amount, userEmail }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutPaymentCreate, { loading, error }] = useMutation(
    CHECKOUT_PAYMENT_CREATE
  );
  const [checkoutEmailUpdate] = useMutation(CHECKOUT_EMAIL_UPDATE);
  const [checkoutShippingMethodUpdate] = useMutation(SHIPPING_METHOD_UPDATE);

  const handleShippingUpdate = async () => {
    const { data } = await checkoutShippingMethodUpdate({
      variables: {
        checkoutId,
        shippingMethodId: "your_shipping_method_id", // Replace with actual ID
      },
    });

    if (data?.checkoutShippingMethodUpdate?.errors.length) {
      console.error(
        "Shipping Method Error:",
        data.checkoutShippingMethodUpdate.errors
      );
      alert("Failed to update shipping method.");
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
      console.error("Email Update Error:", data.checkoutEmailUpdate.errors);
      alert("Failed to update email.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const emailUpdated = await handleEmailUpdate();
    if (!emailUpdated) return;

    const shippingUpdated = await handleShippingUpdate();
    if (!shippingUpdated) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Error creating payment method:", error);
      alert("Payment failed. Please check your card details.");
      return;
    }

    const { data } = await checkoutPaymentCreate({
      variables: {
        checkoutId,
        input: {
          gateway: "saleor.payments.stripe",
          token: paymentMethod.id,
          amount,
        },
      },
    });

    if (data?.checkoutPaymentCreate?.errors.length) {
      console.error("Saleor Payment Error:", data.checkoutPaymentCreate.errors);
      alert("Payment failed.");
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{ style: { base: { fontSize: "16px", color: "#424770" } } }}
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-3 mt-4"
        disabled={!stripe}
      >
        PLACE ORDER
      </button>
    </form>
  );
};

export default function CheckoutPayment({
  activeSection,
  onPaymentSuccess,
  checkoutId,
  totalAmount,
  userEmail,
  shippingMethodId,
}) {
  return (
    <section>
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
              amount={totalAmount}
              userEmail={userEmail}
            />
          </Elements>
        </div>
      )}
    </section>
  );
}
