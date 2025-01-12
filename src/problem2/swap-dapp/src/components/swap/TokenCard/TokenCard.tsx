import React, { useState } from "react";
import styles from "./TokenCard.module.css";
import TokenSelector from "@/components/swap/TokenCard/TokenSelector";
import AmountInput from "@/components/swap/TokenCard/AmountInput";
import TokenPicker from "@/components/swap/TokenPicker/TokenPicker";
import { useSwapContext } from "@/contexts/SwapContext";
import { useTokens } from "@/hooks/useTokens";
import { Button } from "@/components/ui/button";
import { FaSort } from "react-icons/fa";
import { useNetworks } from "@/hooks/useNetworks";
import { useWeb3Context } from "@/contexts/Web3Context";

interface TokenCardProps {
  title: string;
  tokenSymbol?: string;
  network?: string; // Network name (e.g., "on Ethereum")
  amount?: number; // Amount of token
  fiatValue?: string; // Fiat equivalent value (e.g., "~$3,302.55")
  tokenIcon?: string; // URL of the token's icon
  readonly?: boolean;
  rate?: number;
  type?: "source" | "target";
}

const TokenCard: React.FC<TokenCardProps> = ({
  title,
  tokenSymbol,
  network,
  tokenIcon,
  type,
  rate,
  readonly = false,
}) => {
  const [open, setOpen] = useState(false); // Boolean state to control dialog visibility
  const { getTokenNameById, getTokenById } = useTokens();
  const { balanceLoading, balances, getFeeAndRate } = useWeb3Context();

  const {
    state,
    setFromToken,
    setToToken,
    setFromNetwork,
    setToNetwork,
    setFromAmount,
    setToAmount,
  } = useSwapContext();
  const { getNetworkById } = useNetworks();

  let amount = state.fromAmount;
  if (readonly) amount = parseFloat(((rate || 0) * (amount || 0)).toFixed(6));
  const setAmount = type === "source" ? setFromAmount : setToAmount;
  const setToken = type === "source" ? setFromToken : setToToken;
  const selectedToken = type === "source" ? state.fromToken : state.toToken;
  const setNetwork = type === "source" ? setFromNetwork : setToNetwork;
  const selectedNetwork =
    (type === "source" ? state.fromNetwork : state.toNetwork) || network || "";

  const tokenObj = getTokenById(selectedToken || "");
  const networkObj = getNetworkById(selectedNetwork);
  const balance = balances?.find((b) => b.token === selectedToken)?.amount || 0;

  return (
    <div className={styles.card}>
      <div className="RowItem w-full">
        {/* Token Details */}
        <p className={styles.details}>
          {title} <b>{getTokenNameById(selectedToken) || tokenSymbol}</b>
        </p>

        {/* Balance */}
        {type === "source" &&
          balance > 0 &&
          (balanceLoading ? (
            // Skeleton loader for balance
            <div className="w-32 h-4 bg-gray-300 animate-pulse rounded-md" />
          ) : (
            <p
              className="text-ring text-sm cursor-pointer hover:underline"
              onClick={() => {
                console.log(`Balance clicked: ${balance}`);
              }}
            >
              Balance: {balance} ({selectedToken?.toUpperCase()})
            </p>
          ))}
      </div>
      {!tokenSymbol && !selectedToken ? (
        <div className={styles.content}>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Select Token
            <FaSort />
          </Button>
        </div>
      ) : (
        <div className={styles.content}>
          {/* Left Section */}

          <TokenSelector
            tokenName={tokenObj?.name || tokenSymbol || ""}
            tokenIcon={tokenObj?.icon || tokenIcon || ""}
            network={networkObj?.name || network || ""}
            networkIcon={networkObj?.icon || ""}
            onSelect={() => setOpen(true)}
          />
          {/* Right Section */}
          <AmountInput
            token={tokenObj}
            setAmount={setAmount}
            readonly={readonly}
            amount={amount}
          />
        </div>
      )}

      {/* Token Picker */}
      <TokenPicker
        onSelect={(tokenId: string, networkId: string) => {
          setToken(tokenId);
          setNetwork(networkId);
          getFeeAndRate(
            state.fromToken || "",
            state.toToken || "",
            state.fromNetwork || ""
          );
        }}
        open={open}
        setOpen={setOpen}
      ></TokenPicker>
    </div>
  );
};

export default TokenCard;
