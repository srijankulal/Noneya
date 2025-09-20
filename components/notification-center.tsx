"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  type: "alert" | "info" | "warning"
  title: string
  message: string
  timestamp: string
  read: boolean
  cryptoSymbol?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "BTC Price Alert",
      message: "Bitcoin has reached $45,000 - your alert threshold",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      cryptoSymbol: "BTC",
    },
    {
      id: "2",
      type: "info",
      title: "Welcome to CryptoAlert",
      message: "Your crypto monitoring dashboard is ready to use",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "3",
      type: "warning",
      title: "ETH Price Alert",
      message: "Ethereum dropped below $2,500 - your alert threshold",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      cryptoSymbol: "ETH",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-accent" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return <CheckCircle className="w-4 h-4 text-success" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="ghost" size="sm">
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm">You'll see alerts and updates here</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read ? "bg-muted/30" : "bg-accent/10 border-accent/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {notification.cryptoSymbol && (
                        <Badge variant="outline" className="text-xs">
                          {notification.cryptoSymbol}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button onClick={() => markAsRead(notification.id)} variant="ghost" size="icon" className="w-6 h-6">
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
