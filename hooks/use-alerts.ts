"use client"

import { useCallback } from "react"
import useSWR from "swr"
import type { Alert } from "@/app/api/alerts/route"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAlerts() {
  const { data, error, mutate } = useSWR("/api/alerts", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  const alerts: Alert[] = data?.success ? data.data : []
  const isLoading = !data && !error
  const isError = error || (data && !data.success)

  const createAlert = useCallback(
    async (alertData: {
      cryptoSymbol: string
      cryptoName: string
      type: "above" | "below"
      threshold: number
    }) => {
      try {
        const response = await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alertData),
        })

        const result = await response.json()
        if (result.success) {
          mutate() // Refresh the alerts list
          return { success: true, data: result.data }
        }
        return { success: false, error: result.error }
      } catch (error) {
        return { success: false, error: "Failed to create alert" }
      }
    },
    [mutate],
  )

  const updateAlert = useCallback(
    async (id: string, updates: Partial<Alert>) => {
      try {
        const response = await fetch(`/api/alerts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })

        const result = await response.json()
        if (result.success) {
          mutate() // Refresh the alerts list
          return { success: true, data: result.data }
        }
        return { success: false, error: result.error }
      } catch (error) {
        return { success: false, error: "Failed to update alert" }
      }
    },
    [mutate],
  )

  const deleteAlert = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/alerts/${id}`, {
          method: "DELETE",
        })

        const result = await response.json()
        if (result.success) {
          mutate() // Refresh the alerts list
          return { success: true }
        }
        return { success: false, error: result.error }
      } catch (error) {
        return { success: false, error: "Failed to delete alert" }
      }
    },
    [mutate],
  )

  const checkAlerts = useCallback(async () => {
    try {
      const response = await fetch("/api/alerts/check", {
        method: "POST",
      })

      const result = await response.json()
      if (result.success) {
        mutate() // Refresh the alerts list
        return { success: true, data: result.data }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "Failed to check alerts" }
    }
  }, [mutate])

  return {
    alerts,
    isLoading,
    isError,
    createAlert,
    updateAlert,
    deleteAlert,
    checkAlerts,
    refreshAlerts: mutate,
  }
}
