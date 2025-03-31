import { useEffect, useState } from "react";

const usePaymentRequest = (
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
) => {
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    // Convert amount to cents and ensure it's an integer
    const amountInCents = Math.round(parseFloat(amount) * 100);

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Clothd",
        amount: amountInCents,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestPayerAddress: "billing",
    });

    // Check if the Payment Request is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setCanMakePayment(true);
      }
    });

    pr.on("paymentmethod", async (e) => {
      setIsProcessing(true);
      setError(null);

      try {
        // Update email if not already set
        if (userEmail) {
          const { data: emailData } = await checkoutEmailUpdate({
            variables: {
              checkoutId,
              email: userEmail,
            },
          });

          if (emailData?.checkoutEmailUpdate?.errors?.length) {
            const errorMessage = emailData.checkoutEmailUpdate.errors
              .map((err) => err.message)
              .join(", ");
            setError(`Email Update Error: ${errorMessage}`);
            e.complete("fail");
            return;
          }
        }

        // Create payment
        const { data: paymentData } = await checkoutPaymentCreate({
          variables: {
            checkoutId,
            input: {
              gateway: "saleor.payments.stripe",
              token: e.paymentMethod.id,
              amount: parseFloat(amount),
            },
          },
        });

        if (paymentData?.checkoutPaymentCreate?.errors?.length) {
          const errorMessage = paymentData.checkoutPaymentCreate.errors
            .map((err) => err.message)
            .join(", ");
          setError(`Payment Creation Error: ${errorMessage}`);
          e.complete("fail");
          return;
        }

        // Complete checkout
        const { data: completeData } = await checkoutComplete({
          variables: {
            checkoutId,
          },
        });

        if (completeData?.checkoutComplete?.errors?.length) {
          const errorMessage = completeData.checkoutComplete.errors
            .map((err) => err.message)
            .join(", ");
          setError(`Checkout Completion Error: ${errorMessage}`);
          e.complete("fail");
          return;
        }

        if (!completeData?.checkoutComplete?.order?.id) {
          setError("Order creation failed - no order ID received");
          e.complete("fail");
          return;
        }

        // Clear cart data from localStorage
        localStorage.removeItem("cartCount");
        localStorage.removeItem("checkoutId");

        // Call the success callback
        onSuccess();
        e.complete("success");
      } catch (err) {
        console.error("Payment error:", err);
        setError(err.message || "Payment failed. Please try again.");
        e.complete("fail");
      } finally {
        setIsProcessing(false);
      }
    });

    setPaymentRequest(pr);

    return () => {
      if (pr) {
        pr.removeAllListeners();
      }
    };
  }, [
    stripe,
    amount,
    checkoutId,
    checkoutPaymentCreate,
    checkoutEmailUpdate,
    checkoutComplete,
    userEmail,
    setIsProcessing,
    setError,
    onSuccess,
  ]);

  return { paymentRequest, canMakePayment };
};

export default usePaymentRequest;