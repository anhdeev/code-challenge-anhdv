"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTokens } from "@/hooks/useTokens";
import React, { useState } from "react";
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

  // Filter tokens based on the search term
  const filteredTokens = getAllTokens().filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {filteredTokens.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer rounded-lg"
              onClick={() => {
                console.log("token.id", token.id);
                console.log("network", network);
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPicker;
