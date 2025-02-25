// src/services/paymentService.js
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
    amount,
    billingAddress
  ) => {
    if (!stripe) {
      return { error: "Payment system not initialized" };
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
      return { error: `Klarna Error: ${error.message}` };
    }
  
    // For Klarna redirect flow
    if (source.redirect.url) {
      window.location.href = source.redirect.url;
      return { status: "pending" };
    }
  
    return { paymentToken: source.id };
  };
  
  export const processPayment = async (
    checkoutPaymentCreate,
    checkoutComplete,
    stripe,
    checkoutId,
    paymentToken,
    amount
  ) => {
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
        return { error: `Payment Creation Error: ${errorMessage}` };
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
          return { error: `Payment confirmation failed: ${confirmError.message}` };
        }
      }
  
      if (completeData?.checkoutComplete?.errors?.length) {
        const errorMessage = completeData.checkoutComplete.errors
          .map((err) => err.message)
          .join(", ");
        return { error: `Checkout Completion Error: ${errorMessage}` };
      }
  
      return { success: true };
    } catch (err) {
      return { error: `Payment failed: ${err.message}` };
    }
  };