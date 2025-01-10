import React from "react";

interface TokenSelectorProps {
  label: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-medium">ETH</p>
        <p className="text-xs text-gray-500">on Ethereum</p>
      </div>
      <button className="text-sm text-blue-400">Change</button>
    </div>
  );
};

export default TokenSelector;
