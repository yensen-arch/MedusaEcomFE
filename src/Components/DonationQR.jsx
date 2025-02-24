import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const DonationQR = () => {
  const STRIPE_PAYMENT_LINK =
    "https://donate.stripe.com/test_6oEbLo0P0gvngp2cMM";

  return (
    <div className="rounded-none border border-black p-6 flex flex-col items-center w-full max-w-xl">
      <h2 className="text-sm uppercase tracking-[0.2em] mb-6">
        Make a Donation
      </h2>
      <div className="w-3/4 border-t-2 border-gray-400 border-dashed mb-6"></div>
      <p className="text-xs uppercase tracking-[0.2em] mb-6">
        Scan to Donate
      </p>
      <QRCodeCanvas value={STRIPE_PAYMENT_LINK} size={200} level="H" />
    </div>
  );
};

export default DonationQR;
