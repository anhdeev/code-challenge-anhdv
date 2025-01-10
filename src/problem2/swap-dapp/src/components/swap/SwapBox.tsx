import React from "react";
import SwapModeToggle from "./SwapModeToggle";
import TokenSelector from "./TokenSelector";
import AmountInput from "./AmountInput";
import ExchangeRate from "./ExchangeRate";
import ConnectWalletButton from "./ConnectWalletButton";
import SwapActions from "./SwapActions";

const SwapBox = () => {
  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white rounded-lg p-6 shadow-lg">
      {/* Mode Toggle */}
      <SwapModeToggle />

      {/* Swap Input Section */}
      <div className="space-y-4">
        {/* Token 1 */}
        <div className="bg-gray-800 p-4 rounded-md">
          <TokenSelector label="You pay" />
          <AmountInput placeholder="1" />
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <div className="bg-gray-700 p-2 rounded-full">
            {/* Placeholder for swap arrow */}
            <span className="text-gray-400">↓</span>
          </div>
        </div>

        {/* Token 2 */}
        <div className="bg-gray-800 p-4 rounded-md">
          <TokenSelector label="You receive" />
          <AmountInput placeholder="3271.618674" />
        </div>
      </div>

      {/* Exchange Rate */}
      <ExchangeRate />

      {/* Connect Wallet Button */}
      <ConnectWalletButton />

      {/* Swap Actions */}
      <SwapActions />
    </div>
  );
};

export default SwapBox;
