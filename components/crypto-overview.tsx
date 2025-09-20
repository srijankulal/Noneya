"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";

const watchedSymbols = ["BTC", "ETH", "SOL", "ADA"];

// Mock alert counts for each crypto
const alertCounts = {
  BTC: 2,
  ETH: 1,
  SOL: 0,
  ADA: 1,
};

export function CryptoOverview() {
  const { prices, isLoading, isError } = useCryptoPrices(watchedSymbols, 30000);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {watchedSymbols.map((symbol) => (
          <Card key={symbol} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <Badge variant="destructive">Failed to load cryptocurrency data</Badge>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {watchedSymbols.map((symbol) => {
        const priceData = prices[symbol];
        const alerts = alertCounts[symbol as keyof typeof alertCounts] || 0;

        if (!priceData) return null;

        return (
          <Card key={symbol} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{symbol}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {symbol === "BTC"
                      ? "Bitcoin"
                      : symbol === "ETH"
                      ? "Ethereum"
                      : symbol === "SOL"
                      ? "Solana"
                      : symbol === "ADA"
                      ? "Cardano"
                      : symbol}
                  </p>
                </div>
                {alerts > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Target className="w-3 h-3" />
                    {alerts}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold font-mono">
                  ${priceData.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  {priceData.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      priceData.change > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {priceData.change > 0 ? "+" : ""}
                    {priceData.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
