import React, { useState } from "react";
import styles from "./TokenCard.module.css";
import TokenSelector from "@/components/swap/TokenCard/TokenSelector";
import AmountInput from "@/components/swap/TokenCard/AmountInput";
import TokenPicker from "@/components/swap/TokenPicker/TokenPicker";
import { useSwapContext } from "@/contexts/SwapContext";
import { useTokens } from "@/hooks/useTokens";

interface TokenCardProps {
  title: string;
  tokenName?: string;
  tokenSymbol?: string;
  network?: string; // Network name (e.g., "on Ethereum")
  amount?: string; // Amount of token
  fiatValue?: string; // Fiat equivalent value (e.g., "~$3,302.55")
  tokenIcon?: string; // URL of the token's icon
  readonly?: boolean;
  type?: "source" | "target";
}

const TokenCard: React.FC<TokenCardProps> = ({
  title,
  tokenSymbol,
  network,
  amount,
  fiatValue,
  tokenIcon,
  type,
  // readonly = false,
}) => {
  const [open, setOpen] = useState(false); // Boolean state to control dialog visibility
  const { getTokenNameById } = useTokens();

  const {
    state,
    setFromToken,
    setToToken,
    setFromNetwork,
    setToNetwork,
    setFromAmount,
    setToAmount,
  } = useSwapContext();

  const setAmount = type === "source" ? setFromAmount : setToAmount;
  const setToken = type === "source" ? setFromToken : setToToken;
  const selectedToken = type === "source" ? state.fromToken : state.toToken;
  const setNetwork = type === "source" ? setFromNetwork : setToNetwork;
  const selectedNetwork =
    type === "source" ? state.fromNetwork : state.toNetwork;
  const symbol = type === "source" ? state.fromToken : state.toToken;

  return (
    <div className={styles.card}>
      <p className={styles.details}>
        {title} <b>{getTokenNameById(symbol)}</b>
      </p>
      <div className={styles.content}>
        {/* Left Section */}

        <TokenSelector
          tokenName={selectedToken || tokenSymbol}
          network={selectedNetwork || network}
          tokenIcon={tokenIcon}
          onSelect={() => setOpen(true)}
        />
        {/* Right Section */}
        <AmountInput
          amount={amount}
          name={selectedToken || ""}
          fiatValue={fiatValue}
          setAmount={setAmount}
        />
      </div>

      {/* Token Picker */}
      <TokenPicker
        onSelect={(tokenId: string, networkId: string) => {
          setToken(tokenId);
          setNetwork(networkId);
        }}
        open={open}
        setOpen={setOpen}
      ></TokenPicker>
    </div>
  );
};

export default TokenCard;
