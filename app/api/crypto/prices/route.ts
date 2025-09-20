import { NextResponse } from "next/server"

// Mock API - In production, you'd use CoinGecko, CoinMarketCap, or similar
const MOCK_PRICES = {
  BTC: { price: 43250.0, change: 2.45, volume: 28500000000 },
  ETH: { price: 2680.5, change: -1.23, volume: 15200000000 },
  BNB: { price: 315.8, change: 1.87, volume: 1800000000 },
  SOL: { price: 98.75, change: 5.67, volume: 2100000000 },
  XRP: { price: 0.615, change: -2.14, volume: 1500000000 },
  ADA: { price: 0.485, change: -0.89, volume: 850000000 },
  AVAX: { price: 37.2, change: 3.45, volume: 420000000 },
  DOT: { price: 7.85, change: 1.23, volume: 380000000 },
  LINK: { price: 15.4, change: 2.67, volume: 650000000 },
  MATIC: { price: 0.89, change: -1.45, volume: 520000000 },
}

// Simulate price fluctuations
function simulatePriceChange(basePrice: number, baseChange: number): { price: number; change: number } {
  const fluctuation = (Math.random() - 0.5) * 0.02 // ±1% random fluctuation
  const newPrice = basePrice * (1 + fluctuation)
  const newChange = baseChange + (Math.random() - 0.5) * 0.5 // ±0.25% change fluctuation

  return {
    price: Math.round(newPrice * 100) / 100,
    change: Math.round(newChange * 100) / 100,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get("symbols")?.split(",") || Object.keys(MOCK_PRICES)

  try {
    const prices: Record<string, any> = {}

    symbols.forEach((symbol) => {
      const upperSymbol = symbol.toUpperCase()
      if (MOCK_PRICES[upperSymbol as keyof typeof MOCK_PRICES]) {
        const baseData = MOCK_PRICES[upperSymbol as keyof typeof MOCK_PRICES]
        const simulatedData = simulatePriceChange(baseData.price, baseData.change)

        prices[upperSymbol] = {
          symbol: upperSymbol,
          price: simulatedData.price,
          change: simulatedData.change,
          volume: baseData.volume,
          lastUpdated: new Date().toISOString(),
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch prices" }, { status: 500 })
  }
}
