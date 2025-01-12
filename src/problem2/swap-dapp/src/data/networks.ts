import { NetworkIDs } from "@/constants";

export const networks = [
  {
    id: NetworkIDs.Ethereum,
    token: "eth",
    name: "Ethereum",
    icon: "/assets/tokens/eth.svg",
  },
  {
    id: NetworkIDs.Binance,
    token: "bnb",
    name: "BSC",
    icon: "/assets/tokens/bnb.svg",
  },
  {
    id: NetworkIDs.Polygon,
    token: "pol",
    name: "Polygon",
    icon: "/assets/tokens/matic.svg",
  },
  {
    id: NetworkIDs.Solana,
    token: "sol",
    name: "Solana",
    icon: "/assets/tokens/sol.svg",
  },
];
