import { NextResponse } from "next/server";

// Start with empty alerts array - data will be managed client-side with localStorage
let alerts: Alert[] = [];

export interface Alert {
  id: string;
  cryptoSymbol: string;
  cryptoName: string;
  type: "above" | "below";
  threshold: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt: string | null;
  status: "active" | "triggered" | "paused";
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cryptoSymbol, cryptoName, type, threshold } = body;

    if (!cryptoSymbol || !cryptoName || !type || !threshold) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
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
    };

    alerts.push(newAlert);

    return NextResponse.json({
      success: true,
      data: newAlert,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create alert" },
      { status: 500 }
    );
  }
}
