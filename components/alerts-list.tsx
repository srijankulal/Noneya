"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAlerts } from "@/hooks/use-alerts"
import { AlertTriangle, TrendingUp, TrendingDown, Play, Pause, Trash2, RefreshCw } from "lucide-react"
import { useState } from "react"

export function AlertsList() {
  const { alerts, isLoading, isError, updateAlert, deleteAlert, checkAlerts } = useAlerts()
  const [checkingAlerts, setCheckingAlerts] = useState(false)

  const handleToggleAlert = async (id: string, isActive: boolean) => {
    await updateAlert(id, {
      isActive: !isActive,
      status: !isActive ? "active" : "paused",
    })
  }

  const handleDeleteAlert = async (id: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      await deleteAlert(id)
    }
  }

  const handleCheckAlerts = async () => {
    setCheckingAlerts(true)
    await checkAlerts()
    setCheckingAlerts(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (status === "triggered") {
      return (
        <Badge variant="default" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Triggered
        </Badge>
      )
    }
    if (!isActive) {
      return <Badge variant="secondary">Paused</Badge>
    }
    return <Badge variant="outline">Active</Badge>
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Badge variant="destructive">Failed to load alerts</Badge>
          <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Alert Management</CardTitle>
            <Button
              onClick={handleCheckAlerts}
              disabled={checkingAlerts}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${checkingAlerts ? "animate-spin" : ""}`} />
              Check Alerts Now
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No alerts created yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first price alert to get started</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={`${alert.status === "triggered" ? "border-accent bg-accent/5" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{alert.cryptoSymbol}</span>
                      <span className="text-muted-foreground">{alert.cryptoName}</span>
                      {getStatusBadge(alert.status, alert.isActive)}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {alert.type === "above" ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <span>
                        Alert when price goes {alert.type} ${alert.threshold.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Created: {formatDate(alert.createdAt)}</div>
                      {alert.triggeredAt && <div>Triggered: {formatDate(alert.triggeredAt)}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleAlert(alert.id, alert.isActive)}
                      disabled={alert.status === "triggered"}
                    >
                      {alert.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
