import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const productScarcity = {
  "UHJvZHVjdDo2": "27/200 left",
  "UHJvZHVjdDo0": "50/150 left",
  "UHJvZHVjdDox": "23/100 left",
  "UHJvZHVjdDo1": "29/100 left",
  "UHJvZHVjdDo4": "15/100 left",
};

function ScarcityModal() {
  const { productId } = useParams();
  const [isVisible, setIsVisible] = useState(
    () => !localStorage.getItem("seenModal")
  );
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    setIsPulsing(true);
    const firstPulse = setTimeout(() => setIsPulsing(false), 500);
    const secondPulse = setTimeout(() => setIsPulsing(true), 800);
    const stopPulse = setTimeout(() => setIsPulsing(false), 1100);
    const hideTimer = setTimeout(() => setIsVisible(false), 1500);

    return () => {
      clearTimeout(firstPulse);
      clearTimeout(secondPulse);
      clearTimeout(stopPulse);
      clearTimeout(hideTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`px-10 rounded-none border border-black relative z-10 text-center transition-all duration-300 ${
          isPulsing ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        <p className="text-xs uppercase">Drop0</p>
        <p className="text-xs uppercase">{productScarcity[productId] || "N/A"}</p>
      </div>
    </div>
  );
}

export default ScarcityModal;