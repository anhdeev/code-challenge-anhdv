"use client";

import { ActionStage } from "@/components/swap/ActionButton";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SwapState {
  fromToken: string | null; // Token being swapped
  toToken: string | null; // Token being received
  fromAmount: number | null; // Amount of the fromToken to swap
  toAmount: number | null; // Amount of the toToken to receive (calculated)
  slippage: number; // Slippage tolerance in percentage (default: 0.5%)
  fromNetwork: string | null; // Selected network
  toNetwork: string | null; // Selected network
}

interface SwapContextType {
  state: SwapState;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setFromAmount: (amount: number) => void;
  setToAmount: (amount: number) => void;
  setSlippage: (slippage: number) => void;
  setFromNetwork: (network: string) => void;
  setToNetwork: (network: string) => void;
  swap: () => void;
  stage: ActionStage;
  setStage: React.Dispatch<React.SetStateAction<ActionStage>>;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const SwapProvider = ({ children }: { children: ReactNode }) => {
  // Initial state
  const [state, setState] = useState<SwapState>({
    fromToken: "eth",
    fromNetwork: "ethereum",
    toToken: null,
    fromAmount: null,
    toAmount: null,
    slippage: 0.5, // Default slippage tolerance
    toNetwork: null,
  });

  const [stage, setStage] = useState(ActionStage.CONNECT);
  // Context functions to update the state
  const setFromToken = (token: string) =>
    setState((prev) => ({ ...prev, fromToken: token }));
  const setToToken = (token: string) =>
    setState((prev) => ({ ...prev, toToken: token }));
  const setFromAmount = (amount: number) =>
    setState((prev) => ({ ...prev, fromAmount: amount }));
  const setToAmount = (amount: number) =>
    setState((prev) => ({ ...prev, toAmount: amount }));
  const setSlippage = (slippage: number) =>
    setState((prev) => ({ ...prev, slippage }));
  const setFromNetwork = (fromNetwork: string) =>
    setState((prev) => ({ ...prev, fromNetwork }));
  const setToNetwork = (toNetwork: string) =>
    setState((prev) => ({ ...prev, toNetwork }));

  const swap = () => {
    setState((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      fromNetwork: prev.toNetwork,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
      toNetwork: prev.fromNetwork,
    }));
  };

  return (
    <SwapContext.Provider
      value={{
        state,
        setFromToken,
        setToToken,
        setFromAmount,
        setToAmount,
        setSlippage,
        setFromNetwork,
        setToNetwork,
        swap,
        stage,
        setStage,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

// Hook to use the SwapContext
export const useSwapContext = () => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error("useSwap must be used within a SwapProvider");
  }
  return context;
};
