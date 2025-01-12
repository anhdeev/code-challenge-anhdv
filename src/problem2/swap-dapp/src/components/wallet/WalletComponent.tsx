"use client";
import React, { useEffect } from "react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useTokenPrice } from "@/hooks/useTokenPrice";

const BalancePage: React.FC = () => {
  const { wallet, balances } = useWeb3Context();
  const {
    fetchPrices,
    getUsdEstimate,
    loading: priceLoading,
  } = useTokenPrice();

  // Fetch token prices when balances are available
  useEffect(() => {
    if (balances && balances.length > 0) {
      const symbols = balances.map((balance) => balance.token.toLowerCase());
      fetchPrices(symbols);
    }
  }, [balances, fetchPrices]);

  if (!wallet) {
    return (
      <p className="w-4/12 mx-auto">
        Please connect your wallet to view balances.
      </p>
    );
  }

  return (
    <div className="p-4 w-7/12 mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Balances</h1>
      {priceLoading ? (
        <p>Loading token prices...</p>
      ) : balances && balances.length > 0 ? (
        <div className="space-y-4">
          {balances.map((balance) => {
            const usdValue = getUsdEstimate(
              balance.token.toLowerCase(),
              balance.amount
            );
            return (
              <div
                key={balance.token}
                className="flex justify-between items-center p-4 rounded-lg shadow-md"
              >
                {/* Token Details */}
                <div className="flex items-center gap-4">
                  {/* <img
                    src={balance.icon}
                    alt={balance.symbol}
                    className="w-10 h-10 rounded-full"
                  /> */}
                  <div>
                    <p className="text-lg font-medium">{balance.token}</p>
                    <p className="text-gray-400 text-sm">
                      {balance.amount} {balance.token}
                    </p>
                  </div>
                </div>

                {/* USD Value */}
                <div className="text-right">
                  {usdValue !== null ? (
                    <p className="text-gray-300">${usdValue.toFixed(2)}</p>
                  ) : (
                    <p className="text-gray-500">Price unavailable</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No token balances available.</p>
      )}
    </div>
  );
};

export default BalancePage;
