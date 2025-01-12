import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import Image from "next/image";
import { networks } from "@/data/networks";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useSwapContext } from "@/contexts/SwapContext";
import { ActionStage } from "@/components/swap/ActionButton";

const WalletConnect = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const { wallet, balances, setWallet, connect, getBalances } =
    useWeb3Context();
  const { setStage, setFromNetwork } = useSwapContext();

  const handleNetworkChange = (network: (typeof networks)[0]) => {
    setSelectedNetwork(network);
    setWalletConnected(false);
    setIsDropdownOpen(false); // Close dropdown after selecting
    setWallet(null);
    setStage(ActionStage.CONNECT);
    console.log(`Switched to network: ${network.name}`);
  };

  const handleConnectWallet = () => {
    if (walletConnected) {
      const balance =
        balances?.find((b) => b.token === selectedNetwork.token)?.amount || 0;
      alert(`Your ${selectedNetwork.token.toUpperCase()} balance: ${balance}`);
      return;
    }
    alert(`Connecting to your ${selectedNetwork.name} wallet..`);
    setWalletConnected(true);
    connect();
    getBalances(selectedNetwork.id);
    setStage(ActionStage.SELECT);
    setFromNetwork(selectedNetwork.id);
    console.log("Wallet connected");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Network Selector */}
      <div className="relative">
        <button
          onClick={toggleDropdown} // Toggle dropdown on button click
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          type="button"
        >
          <Image
            src={selectedNetwork.icon}
            alt={selectedNetwork.name}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>{selectedNetwork.name}</span>
          <FiChevronDown />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute mt-2 left-0 rounded-lg shadow-lg z-10 w-52 bg-secondary">
            {networks.map((network) => (
              <div
                key={network.id}
                onClick={() => handleNetworkChange(network)}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer"
              >
                <Image
                  src={network.icon}
                  alt={network.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{network.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Wallet Button */}
      <button
        onClick={handleConnectWallet}
        className="flex items-center gap-2 px-4 py-2 rounded-lg"
      >
        <FaWallet />
        <span>{wallet ? "Wallet Connected" : "Connect Wallet"}</span>
      </button>
    </div>
  );
};

export default WalletConnect;
