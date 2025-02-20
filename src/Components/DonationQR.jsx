import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const DonationQR = () => {
  const STRIPE_PAYMENT_LINK =
    "https://donate.stripe.com/test_6oEbLo0P0gvngp2cMM";

  return (
    <div className="rounded-none border border-black p-6 flex flex-col items-center gap-4">
      <h2 className="text-sm font-medium uppercase tracking-wider">
        Scan to Donate
      </h2>
      <QRCodeCanvas value={STRIPE_PAYMENT_LINK} size={200} level="H" />
    </div>
  );
};

export default DonationQR;
