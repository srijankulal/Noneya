"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { Bell, Volume2, Mail, Smartphone, CheckCircle, XCircle } from "lucide-react"
import SubscribeButton from "./SubscribeButton"

export function NotificationSettings() {
  const { permission, preferences, requestPermission, updatePreferences, playNotificationSound } = useNotifications()

  const handlePermissionRequest = async () => {
    const granted = await requestPermission()
    if (granted) {
      updatePreferences({ browserNotifications: true })
    }
  }

  const testNotification = () => {
    if (permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification from CryptoAlert",
        icon: "/favicon.ico",
      })
      playNotificationSound()
    }
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case "granted":
        return (
          <Badge variant="outline" className="gap-1 text-success border-success">
            <CheckCircle className="w-3 h-3" />
            Granted
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="outline" className="gap-1 text-destructive border-destructive">
            <XCircle className="w-3 h-3" />
            Denied
          </Badge>
        )
      default:
        return <Badge variant="secondary">Not Requested</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="font-medium">Browser Notifications</span>
            </div>
            {getPermissionBadge()}
          </div>

          {permission === "default" && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Enable browser notifications to receive alerts even when the app is not active.
              </p>
              <Button onClick={handlePermissionRequest} size="sm">
                Enable Notifications
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <div className="p-3 bg-destructive/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Notifications are blocked. Please enable them in your browser settings to receive alerts.
              </p>
            </div>
          )}

          {permission === "granted" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Show browser notifications for price alerts</span>
              <Switch
                checked={preferences.browserNotifications}
                onCheckedChange={(checked) => updatePreferences({ browserNotifications: checked })}
              />
            </div>
          )}
        </div>

        {/* Sound Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <div>
              <span className="font-medium">Sound Alerts</span>
              <p className="text-sm text-muted-foreground">Play sound when alerts are triggered</p>
            </div>
          </div>
          <Switch
            checked={preferences.soundEnabled}
            onCheckedChange={(checked) => updatePreferences({ soundEnabled: checked })}
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <div>
              <span className="font-medium">Email Notifications</span>
              <p className="text-sm text-muted-foreground">Receive alerts via email (Coming Soon)</p>
            </div>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => updatePreferences({ emailNotifications: checked })}
            disabled
          />
        </div>

        {/* Push Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <div>
                <span className="font-medium">Push Notifications</span>
                <p className="text-sm text-muted-foreground">Receive push notifications even when the app is closed</p>
              </div>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => updatePreferences({ pushNotifications: checked })}
            />
          </div>
          
          {preferences.pushNotifications && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Enable push notifications to receive crypto alerts even when your browser is closed.
              </p>
              <SubscribeButton />
            </div>
          )}
        </div>

        {/* Test Notification */}
        {permission === "granted" && (
          <div className="pt-4 border-t">
            <Button onClick={testNotification} variant="outline" size="sm" className="w-full bg-transparent">
              Test Notification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
