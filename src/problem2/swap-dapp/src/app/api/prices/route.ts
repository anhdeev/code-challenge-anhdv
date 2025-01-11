import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "Missing 'ids' parameter" },
      { status: 400 }
    );
  }

  // Mock token prices
  const mockPrices = {
    bitcoin: { usd: 94624.68 }, // BTC
    ethereum: { usd: 3685.37 }, // ETH
    tether: { usd: 1.0 }, // USDT
    solana: { usd: 219.08 }, // SOL
    binance: { usd: 730.74 }, // BNB
    cardano: { usd: 1.11 }, // ADA
    ripple: { usd: 2.43 }, // XRP
    polkadot: { usd: 6.74 }, // DOT
    litecoin: { usd: 103.9 }, // LTC
    chainlink: { usd: 13.85 }, // LINK
    stellar: { usd: 0.092 }, // XLM
    dogecoin: { usd: 0.3897 }, // DOGE
    avalanche: { usd: 30.0 }, // AVAX
    polygon: { usd: 0.46 }, // POL (formerly MATIC)
    tron: { usd: 0.1231 }, // TRX
    vechain: { usd: 0.05 }, // VET
    eos: { usd: 0.8 }, // EOS
    tezos: { usd: 1.29 }, // XTZ
    monero: { usd: 199.15 }, // XMR
    iota: { usd: 0.32 }, // IOTA
  };

  const symbols = (ids as string)?.split(",") || [];
  const result = symbols.reduce((acc, symbol) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((mockPrices as any)[symbol]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acc[symbol] = (mockPrices as any)[symbol] || { usd: 1 };
    }
    return acc;
  }, {} as { [key: string]: { usd: number } });

  console.log({ result });
  return NextResponse.json(result);
}
