import { NextResponse } from "next/server"

// Generate mock historical data
function generateHistoricalData(symbol: string, days = 7) {
  const data = []
  const basePrice =
    {
      BTC: 43250,
      ETH: 2680,
      SOL: 98.75,
      ADA: 0.485,
    }[symbol] || 100

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Generate realistic price movement
    const volatility = 0.05 // 5% daily volatility
    const trend = Math.sin(i * 0.1) * 0.02 // Slight trend
    const random = (Math.random() - 0.5) * volatility
    const priceMultiplier = 1 + trend + random

    data.push({
      timestamp: date.toISOString(),
      price: Math.round(basePrice * priceMultiplier * 100) / 100,
      volume: Math.round(Math.random() * 1000000000),
    })
  }

  return data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")?.toUpperCase()
  const days = Number.parseInt(searchParams.get("days") || "7")

  if (!symbol) {
    return NextResponse.json({ success: false, error: "Symbol parameter is required" }, { status: 400 })
  }

  try {
    const historicalData = generateHistoricalData(symbol, days)

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        history: historicalData,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch historical data" }, { status: 500 })
  }
}
