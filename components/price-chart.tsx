"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useCryptoHistory, useCryptoPrices } from "@/hooks/use-crypto-prices";

export function PriceChart() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [timeframe, setTimeframe] = useState(7);

  const { history, isLoading: historyLoading } = useCryptoHistory(
    selectedCrypto,
    timeframe
  );
  const { prices } = useCryptoPrices([selectedCrypto], 30000);

  const currentPrice = prices[selectedCrypto];

  const formatChartData = (data: any[]) => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleDateString(),
      price: item.price,
    }));
  };

  const cryptoOptions = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "ADA", name: "Cardano" },
  ];

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="bg-background border border-border rounded px-2 py-1 text-sm"
              >
                {cryptoOptions.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                Live
              </Badge>
            </div>
            {currentPrice && (
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold font-mono">
                  ${currentPrice.price.toLocaleString()}
                </span>
                <span
                  className={`font-medium ${
                    currentPrice.change > 0
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {currentPrice.change > 0 ? "+" : ""}
                  {currentPrice.change.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeframe === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(1)}
            >
              1D
            </Button>
            <Button
              variant={timeframe === 7 ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(7)}
            >
              7D
            </Button>
            <Button
              variant={timeframe === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(30)}
            >
              30D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">
              Loading chart data...
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatChartData(history)}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs"
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Price",
                ]}
              />
              <Line
                type="linear"
                dataKey="price"
                stroke="black"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "black" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
