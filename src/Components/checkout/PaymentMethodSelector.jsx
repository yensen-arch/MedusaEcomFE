// src/components/checkout/PaymentMethodSelector.js
import React from "react";

const PaymentMethodSelector = ({ options, selected, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-2">Select payment method:</div>
      {options.map((option) => (
        <div
          key={option.id}
          className={`p-3 border rounded flex items-center cursor-pointer ${
            selected === option.id
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onChange(option.id)}
        >
          <div className="w-8 h-8 flex items-center justify-center mr-3 text-lg">
            {option.icon}
          </div>
          <div>{option.name}</div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;