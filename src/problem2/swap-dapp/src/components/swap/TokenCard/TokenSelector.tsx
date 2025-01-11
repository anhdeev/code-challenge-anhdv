import Image from "next/image";
import React from "react";
import styles from "./TokenCard.module.css";

interface TokenSelectorProps {
  tokenName: string;
  network: string; // Network name (e.g., "on Ethereum")
  networkIcon: string; // Network name (e.g., "on Ethereum")
  tokenIcon: string; // URL of the token's icon
  onSelect?: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokenName,
  network,
  tokenIcon,
  networkIcon,
  onSelect,
}) => {
  return (
    <div className={styles.selector} onClick={onSelect}>
      {/* Token Icon */}
      <Image
        src={tokenIcon}
        alt={tokenName}
        width={40}
        height={40}
        className={styles.icon}
      />
      {/* Token Details */}
      <div className="pl-2">
        <div className="flex justify-start gap-2">
          <p className={styles.title}>{tokenName}</p>
          <span className="text-gray-400">{">"}</span>
        </div>
        <div className="RowItem whitespace-nowrap">
          <p className={styles.subtitle}>{"on " + network}</p>
          <Image
            src={networkIcon}
            alt={"network"}
            width={16}
            height={16}
            className={styles.icon}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;
