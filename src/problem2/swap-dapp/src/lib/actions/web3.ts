export interface TokenBalance {
  token: string;
  amount: number;
}

export interface WalletInfo {
  address: string;
  balances: TokenBalance[];
  network: string;
}

export interface SwapInfo {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  transactionHash: string;
}

/**
 * Mock function to simulate connecting to a wallet
 */
export async function connectWallet(): Promise<WalletInfo> {
  console.log("Connecting to wallet...");
  await delay(1000); // Mock delay
  return {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    balances: [{ token: "eth", amount: 3.456 }],
    network: "ethereum",
  };
}

/**
 * Mock function to simulate disconnecting from a wallet
 */
export async function disconnectWallet(): Promise<void> {
  console.log("Disconnecting wallet...");
  await delay(500); // Mock delay
}

/**
 * Mock function to simulate fetching wallet balance
 */
export async function getWalletBalances(
  network: string
): Promise<TokenBalance[]> {
  console.log(`Fetching balance for wallet: ${network}`);
  await delay(700); // Mock delay
  return [
    { token: "eth", amount: 45.678 },
    { token: "usdt", amount: 12.34 },
    { token: "sol", amount: 78.9 },
    { token: "avax", amount: 23.45 },
    { token: "pol", amount: 56.78 },
    { token: "bnb", amount: 34.56 },
  ];
}

/**
 * Mock function to simulate a token swap
 */
export async function swapTokens(
  fromToken: string,
  toToken: string,
  network: string,
  fromAmount: string
): Promise<SwapInfo> {
  console.log(
    `Swapping ${fromAmount} ${network} ${fromToken} to ${toToken} on the blockchain...`
  );
  await delay(2000); // Mock delay
  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount: (parseFloat(fromAmount) * 1.2).toFixed(6), // Mock conversion rate
    transactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  };
}

/**
 * Mock function to simulate fetching the current exchange rate
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached: any = {};
export async function getExchangeFeeAndRate(
  fromToken: string,
  toToken: string,
  network: string
): Promise<number[]> {
  console.log(
    `Fetching exchange rate from ${network} ${fromToken} to ${toToken}...`
  );
  await delay(1000); // Mock delay
  if (cached[`${fromToken}${toToken}${network}`]) {
    return cached[`${fromToken}${toToken}${network}`].map(
      (v: number) => v * (1 + (Math.random() - 0.5) * 0.05)
    );
  } else if (cached[`${toToken}${fromToken}${network}`]) {
    const rst = cached[`${toToken}${fromToken}${network}`];
    return [rst[0], 1 / rst[1]];
  }
  cached[`${toToken}${fromToken}${network}`] = [
    parseFloat(Math.random().toFixed(6)) * 50,
    parseFloat(Math.random().toFixed(6)) * 1000,
  ];
  return cached[`${toToken}${fromToken}${network}`];
}

/**
 * Utility function to simulate a delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
