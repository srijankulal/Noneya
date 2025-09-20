"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, TrendingDown, X } from "lucide-react"
import { useAlerts } from "@/hooks/use-alerts"

export function ActiveAlerts() {
  const { alerts, deleteAlert } = useAlerts()

  // Show only active and recently triggered alerts
  const displayAlerts = alerts
    .filter(
      (alert) =>
        alert.isActive ||
        (alert.status === "triggered" &&
          alert.triggeredAt &&
          new Date().getTime() - new Date(alert.triggeredAt).getTime() < 24 * 60 * 60 * 1000), // Last 24 hours
    )
    .slice(0, 5) // Show max 5 alerts

  const handleDeleteAlert = async (id: string) => {
    await deleteAlert(id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Alerts</CardTitle>
          <Badge variant="outline">{displayAlerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayAlerts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No active alerts</p>
            <p className="text-sm">Create some alerts to monitor prices</p>
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.status === "triggered" ? "bg-accent/10 border-accent" : "bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.cryptoSymbol}</span>
                  {alert.type === "above" ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => handleDeleteAlert(alert.id)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-mono">${alert.threshold.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{alert.type}</span>
                </div>
              </div>
              {alert.status === "triggered" && (
                <Badge variant="default" className="mt-2 gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Triggered
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
