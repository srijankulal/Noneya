"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { Alert } from "@/app/api/alerts/route";

export function useAlerts() {
  const [alerts, setAlerts] = useLocalStorage<Alert[]>("crypto-alerts", []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const createAlert = useCallback(
    async (alertData: {
      cryptoSymbol: string;
      cryptoName: string;
      type: "above" | "below";
      threshold: number;
    }) => {
      try {
        setIsLoading(true);
        setIsError(false);

        const newAlert: Alert = {
          id: Date.now().toString(),
          cryptoSymbol: alertData.cryptoSymbol.toUpperCase(),
          cryptoName: alertData.cryptoName,
          type: alertData.type,
          threshold: alertData.threshold,
          isActive: true,
          createdAt: new Date().toISOString(),
          triggeredAt: null,
          status: "active",
        };

        setAlerts((prev) => [...prev, newAlert]);

        return { success: true, data: newAlert };
      } catch (error) {
        console.error("Error creating alert:", error);
        setIsError(true);
        return { success: false, error: "Failed to create alert" };
      } finally {
        setIsLoading(false);
      }
    },
    [setAlerts]
  );

  const updateAlert = useCallback(
    async (id: string, updates: Partial<Alert>) => {
      try {
        setIsLoading(true);
        setIsError(false);

        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          )
        );

        return { success: true };
      } catch (error) {
        console.error("Error updating alert:", error);
        setIsError(true);
        return { success: false, error: "Failed to update alert" };
      } finally {
        setIsLoading(false);
      }
    },
    [setAlerts]
  );

  const deleteAlert = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setIsError(false);

        setAlerts((prev) => prev.filter((alert) => alert.id !== id));

        return { success: true };
      } catch (error) {
        console.error("Error deleting alert:", error);
        setIsError(true);
        return { success: false, error: "Failed to delete alert" };
      } finally {
        setIsLoading(false);
      }
    },
    [setAlerts]
  );

  const checkAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const activeAlerts = alerts.filter(
        (alert) => alert.isActive && alert.status === "active"
      );
      let triggeredCount = 0;

      for (const alert of activeAlerts) {
        try {
          // Use the crypto ID from CoinGecko for API calls
          const cryptoId = alert.cryptoSymbol.toLowerCase();
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`
          );

          if (response.ok) {
            const data = await response.json();
            const currentPrice = data[cryptoId]?.usd;

            if (currentPrice) {
              let shouldTrigger = false;

              if (alert.type === "above" && currentPrice >= alert.threshold) {
                shouldTrigger = true;
              } else if (
                alert.type === "below" &&
                currentPrice <= alert.threshold
              ) {
                shouldTrigger = true;
              }

              if (shouldTrigger) {
                await updateAlert(alert.id, {
                  status: "triggered",
                  triggeredAt: new Date().toISOString(),
                  isActive: false,
                });

                triggeredCount++;

                // Send browser notification
                if (
                  typeof window !== "undefined" &&
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification(`${alert.cryptoSymbol} Price Alert`, {
                    body: `Price ${
                      alert.type === "above" ? "rose above" : "dropped below"
                    } $${alert.threshold}. Current: $${currentPrice.toFixed(
                      2
                    )}`,
                    icon: "/placeholder-logo.png",
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error(
            `Error checking price for ${alert.cryptoSymbol}:`,
            error
          );
        }
      }

      return {
        success: true,
        data: {
          triggeredCount,
          totalChecked: activeAlerts.length,
        },
      };
    } catch (error) {
      console.error("Error checking alerts:", error);
      setIsError(true);
      return { success: false, error: "Failed to check alerts" };
    } finally {
      setIsLoading(false);
    }
  }, [alerts, updateAlert]);

  return {
    alerts,
    isLoading,
    isError,
    createAlert,
    updateAlert,
    deleteAlert,
    checkAlerts,
    refreshAlerts: () => {}, // No-op since we're using localStorage
  };
}
