"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface PriceMonitorProps {
  watchedSymbols: string[];
}

export function PriceMonitor({ watchedSymbols }: PriceMonitorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const { prices, isLoading, isError, refreshPrices, lastUpdated } =
    useCryptoPrices(watchedSymbols, 30000);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Price Monitor
            {isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated: {formatLastUpdated(lastUpdated)}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={refreshPrices}
              disabled={isLoading}
              className="w-8 h-8"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isError && (
          <div className="text-center py-4">
            <Badge variant="destructive">Failed to load prices</Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Check your connection and try again
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-3">
            {watchedSymbols.map((symbol) => {
              const priceData = prices[symbol];
              if (!priceData) return null;

              return (
                <div
                  key={symbol}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <span className="font-bold">{symbol}</span>
                    <div className="text-sm text-muted-foreground">
                      Vol: ${(priceData.volume / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">
                      ${priceData.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm ${
                        priceData.change > 0
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {priceData.change > 0 ? "+" : ""}
                      {priceData.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && watchedSymbols.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No cryptocurrencies in watchlist</p>
            <p className="text-sm">Add some coins to start monitoring</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
