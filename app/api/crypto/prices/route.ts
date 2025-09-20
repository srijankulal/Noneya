import { NextResponse } from "next/server";

// A mapping from common symbols to CoinGecko API IDs
const SYMBOL_TO_ID_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  LINK: "chainlink",
  MATIC: "matic-network",
};

const ALL_SUPPORTED_SYMBOLS = Object.keys(SYMBOL_TO_ID_MAP);
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get("symbols");
  const requestedSymbols = symbolsParam
    ? symbolsParam.split(",")
    : ALL_SUPPORTED_SYMBOLS;

  // Filter for supported symbols and get their CoinGecko IDs
  const coingeckoIds = requestedSymbols
    .map((s) => SYMBOL_TO_ID_MAP[s.toUpperCase()])
    .filter(Boolean); // Remove any undefined entries for unsupported symbols

  if (coingeckoIds.length === 0) {
    return NextResponse.json({
      success: true,
      data: {},
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Construct the API URL
    const ids = coingeckoIds.join(",");
    const url = `${COINGECKO_API_URL}?ids=${ids}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;

    // Fetch data from CoinGecko API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `CoinGecko API request failed with status ${response.status}`
      );
    }
    const apiData = await response.json();

    // Format the response to match the desired structure
    const prices: Record<string, any> = {};
    const idToSymbolMap = Object.fromEntries(
      Object.entries(SYMBOL_TO_ID_MAP).map(([symbol, id]) => [id, symbol])
    );

    for (const id in apiData) {
      const symbol = idToSymbolMap[id];
      if (symbol) {
        const data = apiData[id];
        prices[symbol] = {
          symbol: symbol,
          price: data.usd,
          change: data.usd_24h_change,
          volume: data.usd_24h_vol,
          lastUpdated: new Date(data.last_updated_at * 1000).toISOString(),
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: `Failed to fetch prices: ${errorMessage}` },
      { status: 500 }
    );
  }
}
