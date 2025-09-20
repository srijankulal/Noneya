import { NextResponse } from "next/server"
import type { Alert } from "../route"

// Mock alert storage - same as in route.ts
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const alertIndex = alerts.findIndex((alert) => alert.id === id)
    if (alertIndex === -1) {
      return NextResponse.json({ success: false, error: "Alert not found" }, { status: 404 })
    }

    alerts[alertIndex] = { ...alerts[alertIndex], ...body }

    return NextResponse.json({
      success: true,
      data: alerts[alertIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update alert" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const alertIndex = alerts.findIndex((alert) => alert.id === id)
    if (alertIndex === -1) {
      return NextResponse.json({ success: false, error: "Alert not found" }, { status: 404 })
    }

    alerts.splice(alertIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Alert deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete alert" }, { status: 500 })
  }
}
