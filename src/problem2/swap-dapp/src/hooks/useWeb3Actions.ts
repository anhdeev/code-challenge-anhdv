import { useState, useCallback } from "react";
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

interface UseWeb3Actions {
  wallet: WalletInfo | null;
  balances: TokenBalance[] | null;
  loading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  getBalances: (
    fromToken: string,
    toToken: string
  ) => Promise<number | undefined>;
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
}

export const useWeb3Actions = (): UseWeb3Actions => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balances, setBalances] = useState<TokenBalance[] | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Connects to the wallet and updates the state.
   */
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

  /**
   * Disconnects the wallet and resets the state.
   */
  const disconnect = useCallback(() => {
    setWallet(null);
    setBalances(null);
    disconnectWallet(); // Optional if it has backend logic
  }, []);

  /**
   * Performs a token swap.
   */
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
        console.log("Swap successful:", swapResult);
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
        return getExchangeFeeAndRate(fromToken, toToken, network);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        return [0, 0];
      }
    },
    []
  );

  const getBalances = useCallback(
    async (fromToken: string, toToken: string) => {
      try {
        return getWalletBalances(fromToken, toToken);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    },
    []
  );

  return {
    wallet,
    balances,
    loading,
    connect,
    disconnect,
    swap,
    getBalances,
    getFeeAndRate,
  };
};
