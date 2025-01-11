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
  address: string,
  network: string,
  symbol = "eth"
): Promise<number> {
  console.log(`Fetching balance for wallet: ${address}, ${network}, ${symbol}`);
  await delay(700); // Mock delay
  return Math.random() * 100;
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
export async function getExchangeFeeAndRate(
  fromToken: string,
  toToken: string,
  network: string
): Promise<number[]> {
  console.log(
    `Fetching exchange rate from ${network} ${fromToken} to ${toToken}...`
  );
  await delay(400); // Mock delay
  return [0.5, 12];
}

/**
 * Utility function to simulate a delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
