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

  const mockPrices = {
    btc: { usd: 94624.68 }, // Bitcoin
    eth: { usd: 3685.37 }, // Ethereum
    usdt: { usd: 1.0 }, // Tether
    sol: { usd: 219.08 }, // Solana
    bnb: { usd: 730.74 }, // Binance Coin
    ada: { usd: 1.11 }, // Cardano
    xrp: { usd: 2.43 }, // Ripple
    dot: { usd: 6.74 }, // Polkadot
    ltc: { usd: 103.9 }, // Litecoin
    link: { usd: 13.85 }, // Chainlink
    xlm: { usd: 0.092 }, // Stellar
    doge: { usd: 0.3897 }, // Dogecoin
    avax: { usd: 30.0 }, // Avalanche
    pol: { usd: 0.46 }, // Polygon (formerly MATIC)
    trx: { usd: 0.1231 }, // Tron
    vet: { usd: 0.05 }, // VeChain
    eos: { usd: 0.8 }, // EOS
    xtz: { usd: 1.29 }, // Tezos
    xmr: { usd: 199.15 }, // Monero
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

  return NextResponse.json(result);
}
