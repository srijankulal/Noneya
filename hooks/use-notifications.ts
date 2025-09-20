"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export interface NotificationPreferences {
  browserNotifications: boolean
  soundEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    browserNotifications: true,
    soundEnabled: true,
    emailNotifications: false,
    pushNotifications: false,
  })
  const { toast } = useToast()

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }

    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("notification-preferences")
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }

    // Check for existing push subscription
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setPushSubscription(subscription)
        })
      })
    }
  }, [])

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    }
    return false
  }, [])

  // Send browser notification
  const sendBrowserNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!preferences.browserNotifications || permission !== "granted") {
        return null
      }

      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      })

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    },
    [permission, preferences.browserNotifications],
  )

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!preferences.soundEnabled) return

    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }, [preferences.soundEnabled])

  // Send alert notification
  const sendAlertNotification = useCallback(
    (alert: {
      cryptoSymbol: string
      cryptoName: string
      type: "above" | "below"
      threshold: number
      currentPrice: number
    }) => {
      const title = `${alert.cryptoSymbol} Price Alert`
      const body = `${alert.cryptoName} is now ${alert.type} $${alert.threshold.toLocaleString()}. Current price: $${alert.currentPrice.toLocaleString()}`

      // Browser notification
      sendBrowserNotification(title, {
        body,
        tag: `alert-${alert.cryptoSymbol}`,
        requireInteraction: true,
      })

      // In-app toast notification
      toast({
        title,
        description: body,
        duration: 10000,
      })

      // Play sound
      playNotificationSound()
    },
    [sendBrowserNotification, toast, playNotificationSound],
  )

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPreferences }
      localStorage.setItem("notification-preferences", JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    permission,
    preferences,
    pushSubscription,
    requestPermission,
    sendBrowserNotification,
    sendAlertNotification,
    playNotificationSound,
    updatePreferences,
  }
}
