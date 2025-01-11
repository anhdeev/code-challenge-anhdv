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

interface TokenCardProps {
  title: string;
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
  const { getTokenNameById, getTokenById } = useTokens();

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

  const setAmount = type === "source" ? setFromAmount : setToAmount;
  const setToken = type === "source" ? setFromToken : setToToken;
  const selectedToken = type === "source" ? state.fromToken : state.toToken;
  const setNetwork = type === "source" ? setFromNetwork : setToNetwork;
  const selectedNetwork =
    (type === "source" ? state.fromNetwork : state.toNetwork) || network || "";
  const symbol = type === "source" ? state.fromToken : state.toToken;

  const tokenObj = getTokenById(symbol || "");
  const networkObj = getNetworkById(selectedNetwork);

  console.log({ state, networkObj });
  return (
    <div className={styles.card}>
      <p className={styles.details}>
        {title} <b>{getTokenNameById(symbol) || tokenSymbol}</b>
      </p>
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
            amount={amount}
            name={selectedToken || ""}
            fiatValue={fiatValue || "0"}
            setAmount={setAmount}
          />
        </div>
      )}

      {/* Token Picker */}
      <TokenPicker
        onSelect={(tokenId: string, networkId: string) => {
          console.log({ tokenId, networkId });
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
