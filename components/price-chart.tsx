"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Search } from "lucide-react";
import { useCryptoHistory, useCryptoPrices } from "@/hooks/use-crypto-prices";

interface Coin {
  id: string;
  symbol: string;
  name: string;
}

function useCoinGeckoList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch top 100 coins by market cap directly
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrency data");
        }
        
        const data = await response.json();
        
        // Transform the data to match our Coin interface
        const transformedCoins: Coin[] = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
        }));
        
        setCoins(transformedCoins);
      } catch (error) {
        console.error("Failed to fetch coin list:", error);
        setError("Failed to load cryptocurrency options");
        
        // Fallback to hardcoded popular coins
        const fallbackCoins: Coin[] = [
          { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
          { id: "ethereum", symbol: "eth", name: "Ethereum" },
          { id: "solana", symbol: "sol", name: "Solana" },
          { id: "cardano", symbol: "ada", name: "Cardano" },
          { id: "binancecoin", symbol: "bnb", name: "BNB" },
          { id: "ripple", symbol: "xrp", name: "XRP" },
          { id: "dogecoin", symbol: "doge", name: "Dogecoin" },
          { id: "polygon", symbol: "matic", name: "Polygon" },
          { id: "avalanche-2", symbol: "avax", name: "Avalanche" },
          { id: "chainlink", symbol: "link", name: "Chainlink" },
        ];
        setCoins(fallbackCoins);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return { coins, isLoading, error };
}

export function PriceChart() {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { coins: cryptoOptions, isLoading: coinsLoading, error: coinsError } = useCoinGeckoList();
  const { history, isLoading: historyLoading } = useCryptoHistory(
    selectedCrypto,
    timeframe
  );
  const { prices } = useCryptoPrices([selectedCrypto], 30000);

  const currentPrice = prices[selectedCrypto];

  // Get the selected coin details for display
  const selectedCoin = cryptoOptions.find(coin => coin.id === selectedCrypto);

  // Filter coins based on search term
  const filteredCoins = useMemo(() => {
    if (!searchTerm) return cryptoOptions;
    return cryptoOptions.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cryptoOptions, searchTerm]);

  const formatChartData = (data: any[]) => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleDateString(),
      price: item.price,
    }));
  };

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="bg-background border border-border rounded px-2 py-1 text-sm min-w-[200px]"
                  disabled={coinsLoading}
                >
                  {coinsLoading ? (
                    <option>Loading coins...</option>
                  ) : coinsError ? (
                    <option>Using fallback coins...</option>
                  ) : cryptoOptions.length === 0 ? (
                    <option>No coins available</option>
                  ) : (
                    cryptoOptions.map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.name} ({crypto.symbol.toUpperCase()})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {coinsLoading ? "Loading..." : coinsError ? "Fallback" : "Live"}
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
                  {currentPrice.change}%
                </span>
              </div>
            )}
            {!currentPrice && selectedCoin && (
              <div className="text-muted-foreground">
                {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
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
