import React from "react";
import Image from "next/image";
import { networks } from "@/data/networks"; // Network data
import { tokens } from "@/data/tokens"; // Token data

const WalletPage = () => {
  return (
    <div className=" bg-gray-900 text-white p-4">
      {/* Wallet Balance Overview */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <p className="text-gray-400">Total Balance</p>
        <h2 className="text-3xl font-bold">$12,345.67</h2>
      </div>

      {/* Network Selector */}
      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Select Network</label>
        <select className="w-full bg-gray-800 text-gray-300 p-3 rounded-lg">
          {networks.map((network) => (
            <option key={network.id} value={network.id}>
              {network.name}
            </option>
          ))}
        </select>
      </div>

      {/* Token List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Your Assets</h3>
        {tokens.map((token) => (
          <div
            key={token.id}
            className="flex items-center justify-between bg-gray-800 rounded-lg p-4 shadow-md"
          >
            {/* Token Info */}
            <div className="flex items-center gap-4">
              <Image
                src={token.icon}
                alt={token.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h4 className="font-medium">{token.name}</h4>
                <p className="text-gray-400">{token.symbol}</p>
              </div>
            </div>

            {/* Token Balance */}
            <div className="text-right">
              <p className="font-bold">12.34 {token.symbol}</p>
              <p className="text-gray-400">~$1,234.56</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around mt-6">
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-medium">
          Send
        </button>
        <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-medium">
          Receive
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg text-lg font-medium">
          Buy
        </button>
      </div>
    </div>
  );
};

export default WalletPage;
