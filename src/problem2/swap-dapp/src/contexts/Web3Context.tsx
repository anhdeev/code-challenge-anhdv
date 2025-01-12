"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  connectWallet,
  disconnectWallet,
  swapTokens,
  WalletInfo,
  TokenBalance,
  SwapInfo,
  getExchangeFeeAndRate,
  getWalletBalances,
} from "@/lib/actions/web3";

interface Web3ActionsContextValue {
  wallet: WalletInfo | null;
  balances: TokenBalance[] | null;
  setWallet: React.Dispatch<React.SetStateAction<WalletInfo | null>>;
  loading: boolean;
  balanceLoading: boolean;
  fee: number;
  rate: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  getBalances: (network: string) => Promise<void>;
  getFeeAndRate: (
    fromToken: string,
    toToken: string,
    network: string
  ) => Promise<number[]>;
  swap: (
    fromToken: string,
    toToken: string,
    network: string,
    fromAmount: string
  ) => Promise<SwapInfo | null>;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

const Web3ActionsContext = createContext<Web3ActionsContextValue | undefined>(
  undefined
);

export const Web3ActionsProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balances, setBalances] = useState<TokenBalance[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [fee, setFee] = useState(0);
  const [rate, setRate] = useState(0);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const connectedWallet = await connectWallet();
      setWallet(connectedWallet);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setBalances(null);
    disconnectWallet();
  }, []);

  const swap = useCallback(
    async (
      fromToken: string,
      toToken: string,
      network: string,
      fromAmount: string
    ): Promise<SwapInfo | null> => {
      if (!wallet) {
        console.warn("Wallet not connected");
        return null;
      }
      setLoading(true);
      try {
        const swapResult = await swapTokens(
          fromToken,
          toToken,
          network,
          fromAmount
        );
        return swapResult;
      } catch (error) {
        console.error("Failed to swap tokens:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [wallet]
  );

  const getFeeAndRate = useCallback(
    async (fromToken: string, toToken: string, network: string) => {
      try {
        setLoading(true);
        const rst = await getExchangeFeeAndRate(fromToken, toToken, network);
        setFee(rst[0]);
        setRate(rst[1]);
        return rst;
      } catch (error) {
        console.error("Failed to get exchange fee and rate:", error);
        return [0, 0];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBalances = useCallback(async (network: string) => {
    try {
      setBalanceLoading(true);
      const balances = await getWalletBalances(network);
      setBalances(balances);
    } catch (error) {
      console.error("Failed to get wallet balances:", error);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  return (
    <Web3ActionsContext.Provider
      value={{
        wallet,
        setWallet,
        balances,
        loading,
        balanceLoading,
        connect,
        disconnect,
        swap,
        getBalances,
        getFeeAndRate,
        fee,
        rate,
        setRate,
      }}
    >
      {children}
    </Web3ActionsContext.Provider>
  );
};

export const useWeb3Context = (): Web3ActionsContextValue => {
  const context = useContext(Web3ActionsContext);
  if (!context) {
    throw new Error("useWeb3Context must be used within a Web3ActionsProvider");
  }
  return context;
};
