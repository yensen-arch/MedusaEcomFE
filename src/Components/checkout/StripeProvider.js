// src/components/checkout/StripeProvider.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_live_51QtM2fAotN9X1sy1UT2tPBi1t4qw6COv1egO1SAKoO1RnppBujn8R9P5IkJVwq9XzPMQCUT7CLVV6zogcubYV6UG00exB7bwNc"
);

export default stripePromise;