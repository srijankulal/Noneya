"use client"

import { useCallback } from "react"
import useSWR from "swr"

export interface CryptoPrice {
  symbol: string
  price: number
  change: number
  volume: number
  lastUpdated: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCryptoPrices(symbols: string[], refreshInterval = 30000) {
  const symbolsParam = symbols.join(",")

  const { data, error, mutate } = useSWR(
    symbols.length > 0 ? `/api/crypto/prices?symbols=${symbolsParam}` : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )

  const prices = data?.success ? data.data : {}
  const isLoading = !data && !error
  const isError = error || (data && !data.success)

  const refreshPrices = useCallback(() => {
    mutate()
  }, [mutate])

  return {
    prices,
    isLoading,
    isError,
    refreshPrices,
    lastUpdated: data?.timestamp,
  }
}

export function useCryptoHistory(symbol: string, days = 7) {
  const { data, error } = useSWR(symbol ? `/api/crypto/history?symbol=${symbol}&days=${days}` : null, fetcher)

  const history = data?.success ? data.data.history : []
  const isLoading = !data && !error
  const isError = error || (data && !data.success)

  return {
    history,
    isLoading,
    isError,
  }
}
