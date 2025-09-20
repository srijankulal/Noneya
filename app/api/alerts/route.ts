import { NextResponse } from "next/server"

// Mock alert storage - In production, use a database
const alerts: Alert[] = [
  {
    id: "1",
    cryptoSymbol: "BTC",
    cryptoName: "Bitcoin",
    type: "above",
    threshold: 45000,
    isActive: true,
    createdAt: new Date("2024-01-15").toISOString(),
    triggeredAt: null,
    status: "active",
  },
  {
    id: "2",
    cryptoSymbol: "ETH",
    cryptoName: "Ethereum",
    type: "below",
    threshold: 2500,
    isActive: true,
    createdAt: new Date("2024-01-16").toISOString(),
    triggeredAt: null,
    status: "active",
  },
  {
    id: "3",
    cryptoSymbol: "BTC",
    cryptoName: "Bitcoin",
    type: "above",
    threshold: 42000,
    isActive: false,
    createdAt: new Date("2024-01-14").toISOString(),
    triggeredAt: new Date("2024-01-17").toISOString(),
    status: "triggered",
  },
]

export interface Alert {
  id: string
  cryptoSymbol: string
  cryptoName: string
  type: "above" | "below"
  threshold: number
  isActive: boolean
  createdAt: string
  triggeredAt: string | null
  status: "active" | "triggered" | "paused"
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cryptoSymbol, cryptoName, type, threshold } = body

    if (!cryptoSymbol || !cryptoName || !type || !threshold) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      cryptoSymbol: cryptoSymbol.toUpperCase(),
      cryptoName,
      type,
      threshold: Number(threshold),
      isActive: true,
      createdAt: new Date().toISOString(),
      triggeredAt: null,
      status: "active",
    }

    alerts.push(newAlert)

    return NextResponse.json({
      success: true,
      data: newAlert,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create alert" }, { status: 500 })
  }
}
