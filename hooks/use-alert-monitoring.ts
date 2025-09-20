"use client"

import { useEffect, useCallback } from "react"
import { useAlerts } from "./use-alerts"
import { useCryptoPrices } from "./use-crypto-prices"
import { useNotifications } from "./use-notifications"

export function useAlertMonitoring() {
  const { alerts } = useAlerts()
  const { sendAlertNotification } = useNotifications()

  // Get all unique symbols from active alerts
  const activeAlertSymbols = alerts
    .filter((alert) => alert.isActive && alert.status === "active")
    .map((alert) => alert.cryptoSymbol)

  const uniqueSymbols = [...new Set(activeAlertSymbols)]
  const { prices } = useCryptoPrices(uniqueSymbols, 30000) // Check every 30 seconds

  const checkAlerts = useCallback(() => {
    if (!prices || Object.keys(prices).length === 0) return

    alerts
      .filter((alert) => alert.isActive && alert.status === "active")
      .forEach((alert) => {
        const currentPrice = prices[alert.cryptoSymbol]?.price
        if (!currentPrice) return

        let shouldTrigger = false

        if (alert.type === "above" && currentPrice >= alert.threshold) {
          shouldTrigger = true
        } else if (alert.type === "below" && currentPrice <= alert.threshold) {
          shouldTrigger = true
        }

        if (shouldTrigger) {
          sendAlertNotification({
            cryptoSymbol: alert.cryptoSymbol,
            cryptoName: alert.cryptoName,
            type: alert.type,
            threshold: alert.threshold,
            currentPrice,
          })
        }
      })
  }, [alerts, prices, sendAlertNotification])

  // Check alerts whenever prices update
  useEffect(() => {
    checkAlerts()
  }, [checkAlerts])

  return {
    activeAlertsCount: activeAlertSymbols.length,
    monitoredSymbols: uniqueSymbols,
  }
}
