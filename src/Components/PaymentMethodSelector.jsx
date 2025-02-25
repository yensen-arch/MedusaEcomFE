import React from 'react';

const PaymentMethodSelector = ({ options, selected, onChange }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Payment Method</h3>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`flex items-center p-3 border ${
              selected === option.id
                ? 'border-black bg-gray-50'
                : 'border-gray-300'
            } rounded focus:outline-none hover:bg-gray-50 transition-colors`}
            onClick={() => onChange(option.id)}
          >
            <span className="mr-2 w-6 h-6 flex items-center justify-center">
              {option.icon}
            </span>
            <span className="text-sm">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;