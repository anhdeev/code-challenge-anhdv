"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTokens } from "@/hooks/useTokens";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SearchWithNetwork from "@/components/swap/TokenPicker/SearchBar";
import { NetworkIDs } from "@/constants";

interface TokenPickerProps {
  onSelect: (tokenId: string, networkId: string) => void; // Callback when a token is selected
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenPicker: React.FC<TokenPickerProps> = ({
  onSelect,
  open,
  setOpen,
}) => {
  const [network, setNetwork] = useState(NetworkIDs.Ethereum);
  const { getAllTokens } = useTokens();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleTokens, setVisibleTokens] = useState(10); // Initial number of tokens to show

  // Filter tokens based on the search term
  const allTokens = getAllTokens().filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tokensToDisplay = allTokens.slice(0, visibleTokens);

  // Handle scrolling to load more tokens
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // Load 10 more tokens when scrolled to the bottom
      setVisibleTokens((prev) => Math.min(prev + 10, allTokens.length));
    }
  };

  // Reset visible tokens when the search term or network changes
  useEffect(() => {
    setVisibleTokens(10);
  }, [searchTerm, network]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Dialog Content */}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a Token</DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <SearchWithNetwork
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          network={network}
          setNetwork={setNetwork}
        />

        {/* Token List */}
        <div
          className="space-y-4 max-h-80 overflow-y-auto"
          onScroll={handleScroll}
        >
          {tokensToDisplay.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer rounded-lg"
              onClick={() => {
                onSelect(token.id, network);
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={token.icon}
                  alt={token.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{token.name}</p>
                  <p className="text-xs text-primary">{token.symbol}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {visibleTokens < allTokens.length && (
            <div className="text-center text-sm text-gray-500 py-2">
              Loading more tokens...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPicker;
