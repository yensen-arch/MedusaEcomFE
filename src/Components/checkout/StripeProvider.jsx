// src/components/checkout/StripeProvider.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QtM2fAotN9X1sy17CBqLAFeybXj9BbKu1wKY8IQhY5PcAwy4kQNM23XYcTinaTASJIJNEpzd82seY8sEMpSzk8b00pTVhX3Qp"
);

export default stripePromise;