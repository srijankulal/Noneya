import { NextResponse } from "next/server";
import type { Alert } from "../route";

// Start with empty alerts array
let alerts: Alert[] = [];

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const alertIndex = alerts.findIndex((alert) => alert.id === id);
    if (alertIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    alerts[alertIndex] = { ...alerts[alertIndex], ...body };

    return NextResponse.json({
      success: true,
      data: alerts[alertIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update alert" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const alertIndex = alerts.findIndex((alert) => alert.id === id);
    if (alertIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    alerts.splice(alertIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
