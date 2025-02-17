import { useEffect, useState } from "react";

function Cart({ isOpen }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // delay to allow fade-out animation
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-16 right-4 bg-white p-4 w-64 h-screen border border-black z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-lg mb-2">CART</h2>
      <div className="text-gray-500">Your cart is empty.</div>
    </div>
  );
}

export default Cart;
