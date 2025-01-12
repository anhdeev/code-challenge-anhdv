import { NetworkIDs } from "@/constants";

export const networks = [
  {
    id: NetworkIDs.Ethereum,
    token: "eth",
    name: "Ethereum",
    icon: "/assets/tokens/ETH.svg",
  },
  {
    id: NetworkIDs.Binance,
    token: "bnb",
    name: "BSC",
    icon: "/assets/tokens/BNB.svg",
  },
  {
    id: NetworkIDs.Polygon,
    token: "pol",
    name: "Polygon",
    icon: "/assets/tokens/MATIC.svg",
  },
  {
    id: NetworkIDs.Solana,
    token: "sol",
    name: "Solana",
    icon: "/assets/tokens/SOL.svg",
  },
];
