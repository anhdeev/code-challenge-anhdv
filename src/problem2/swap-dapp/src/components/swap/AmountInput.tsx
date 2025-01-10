import React from "react";

interface AmountInputProps {
  placeholder: string;
}

const AmountInput: React.FC<AmountInputProps> = ({ placeholder }) => {
  return (
    <input
      type="text"
      className="w-full bg-transparent text-right text-xl font-medium placeholder-gray-500 focus:outline-none"
      placeholder={placeholder}
    />
  );
};

export default AmountInput;
