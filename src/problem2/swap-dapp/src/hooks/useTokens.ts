import { tokens } from "@/data/tokens";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

export const useTokens = () => {
  const getAllTokens = () => tokens;

  const getTokenById = (id: string): Token | undefined => {
    return tokens.find((token) => token.id === id);
  };

  const getTokenNameById = (id: string | null): string => {
    return tokens.find((token) => token.id === id)?.name || "";
  };

  return {
    getAllTokens,
    getTokenById,
    getTokenNameById,
  };
};
