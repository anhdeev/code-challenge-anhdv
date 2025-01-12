import { useState, useCallback } from "react";

interface TokenPrice {
  [symbol: string]: number; // Token symbol mapped to its USD price (e.g., { ETH: 3000, USDT: 1 })
}

export const useTokenPrice = () => {
  const [prices, setPrices] = useState<TokenPrice>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch token prices from an API or a mock source
   * @param symbols List of token symbols (e.g., ["eth", "usdt", "btc"])
   */
  const fetchPrices = useCallback(async (symbols: string[]) => {
    setLoading(true);
    setError(null);

    console.log(`Fetching prices for ${symbols.join(", ")}`);
    try {
      // Call the Next.js API
      const response = await fetch(`/api/prices?ids=${symbols.join(",")}`);
      if (!response.ok) {
        console.error("Failed to fetch prices:", response.statusText);
        return null;
      }
      const data: { [key: string]: { usd: number } } = await response.json();

      // Transform API response into { token: price } format
      const fetchedPrices: TokenPrice = symbols.reduce((acc, symbol) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc as any)[symbol] = data[symbol]?.usd || 0;
        return acc;
      }, {});

      console.log("Fetched prices:", fetchedPrices);
      setPrices(fetchedPrices);
    } catch (err) {
      console.error("Error fetching token prices:", err);
      setError("Failed to fetch token prices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get the estimated USD value of a token amount
   * @param symbol Token symbol (e.g., "eth", "usdt")
   * @param amount Token amount
   * @returns Estimated USD value or null if price is unavailable
   */
  const getUsdEstimate = useCallback(
    (symbol: string, amount: number): number | null => {
      if (!prices[symbol]) {
        console.warn(`Price for ${symbol} is unavailable.`);
        return null;
      }
      return prices[symbol] * amount;
    },
    [prices]
  );

  return {
    prices,
    loading,
    error,
    fetchPrices,
    getUsdEstimate,
  };
};
