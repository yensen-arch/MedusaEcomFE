import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CHECKOUT_PAYMENT_CREATE } from "../graphql/queries";
import { useMutation } from "@apollo/client";

const stripePromise = loadStripe("pk_test_51QtM2fAotN9X1sy17CBqLAFeybXj9BbKu1wKY8IQhY5PcAwy4kQNM23XYcTinaTASJIJNEpzd82seY8sEMpSzk8b00pTVhX3Qp");

const CheckoutForm = ({ onSuccess, checkoutId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutPaymentCreate, { loading, error }] = useMutation(CHECKOUT_PAYMENT_CREATE);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    console.log("Checkout ID:", checkoutId);
    if (!checkoutId) {
      alert("Checkout ID is missing.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    try {
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
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "16px", color: "#424770" } } }} />
      <button type="submit" className="w-full bg-black text-white py-3 mt-4" disabled={!stripe}>
        PLACE ORDER
      </button>
    </form>
  );
};

export default function CheckoutPayment({ activeSection, onPaymentSuccess, checkoutId, amount }) {
  return (
    <section>
      <h2 className={activeSection === "payment" ? "font-medium" : "text-gray-400"}>3. PAYMENT</h2>
      {activeSection === "payment" && (
        <div className="mt-4 space-y-4">
          <Elements stripe={stripePromise}>
            <CheckoutForm onSuccess={onPaymentSuccess} checkoutId={checkoutId} amount={amount} />
          </Elements>
        </div>
      )}
    </section>
  );
}
