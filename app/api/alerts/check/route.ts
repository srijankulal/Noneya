import { NextResponse } from "next/server"
import type { Alert } from "../route"

// Mock alert storage and price fetching
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
]

const MOCK_PRICES = {
  BTC: 43250.0,
  ETH: 2680.5,
  SOL: 98.75,
  ADA: 0.485,
}

export async function POST() {
  try {
    const triggeredAlerts: Alert[] = []
    const currentTime = new Date().toISOString()

    // Check each active alert
    for (const alert of alerts) {
      if (!alert.isActive || alert.status !== "active") continue

      const currentPrice = MOCK_PRICES[alert.cryptoSymbol as keyof typeof MOCK_PRICES]
      if (!currentPrice) continue

      let shouldTrigger = false

      if (alert.type === "above" && currentPrice >= alert.threshold) {
        shouldTrigger = true
      } else if (alert.type === "below" && currentPrice <= alert.threshold) {
        shouldTrigger = true
      }

      if (shouldTrigger) {
        alert.status = "triggered"
        alert.triggeredAt = currentTime
        alert.isActive = false
        triggeredAlerts.push(alert)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        triggeredAlerts,
        totalChecked: alerts.filter((a) => a.isActive).length,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to check alerts" }, { status: 500 })
  }
}
