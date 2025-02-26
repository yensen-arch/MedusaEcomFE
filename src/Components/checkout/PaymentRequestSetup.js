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
            event.complete("fail");
            setIsProcessing(false);
            return;
          }

          const { data: createData } = await checkoutPaymentCreate({
            variables: {
              checkoutId,
              input: {
                gateway: "saleor.payments.stripe",
                token: event.paymentMethod.id,
                amount: parseFloat(amount) * 100, // Converting to cents for Saleor
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
          setCanMakePayment(result);
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, amount, checkoutId, checkoutPaymentCreate, checkoutEmailUpdate, checkoutComplete, userEmail, setIsProcessing, setError, onSuccess]);

  return { paymentRequest, canMakePayment };
};

export default usePaymentRequest;