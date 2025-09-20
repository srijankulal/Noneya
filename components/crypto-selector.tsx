"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Star,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the structure for our crypto data
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
}

// Initial watchlist (using coin IDs from CoinGecko)
const initialWatchlist = ["bitcoin", "ethereum", "solana", "cardano"];

export function CryptoSelector() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCryptos, setAllCryptos] = useState<CryptoData[]>([]);
  const [watchedCryptoIds, setWatchedCryptoIds] =
    useState<string[]>(initialWatchlist);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from CoinGecko API");
        }
        const data = await response.json();
        const formattedData: CryptoData[] = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
        }));
        setAllCryptos(formattedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const watchedCryptos = allCryptos.filter((crypto) =>
    watchedCryptoIds.includes(crypto.id)
  );

  const filteredCryptos = allCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleWatch = (cryptoId: string) => {
    setWatchedCryptoIds((prev) =>
      prev.includes(cryptoId)
        ? prev.filter((id) => id !== cryptoId)
        : [...prev, cryptoId]
    );
  };

  const isWatched = (cryptoId: string) => watchedCryptoIds.includes(cryptoId);

  return (
    <div className="space-y-6">
      {/* Watched Cryptocurrencies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Watchlist</CardTitle>
            <Badge variant="outline">{watchedCryptos.length} coins</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading Watchlist...</span>
            </div>
          ) : error ? (
            <div className="text-destructive text-center p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchedCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{crypto.symbol}</span>
                      <Star className="w-4 h-4 fill-accent text-accent" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWatch(crypto.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {crypto.name}
                  </p>
                  <div className="space-y-1">
                    <div className="text-lg font-bold font-mono">
                      ${crypto.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      {crypto.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span
                        className={`text-xs ${
                          crypto.change > 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {crypto.change > 0 ? "+" : ""}
                        {(crypto.change || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Cryptocurrency */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full gap-2" disabled={isLoading || !!error}>
            <Plus className="w-4 h-4" />
            Add Cryptocurrency to Watchlist
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Cryptocurrency</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Crypto List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="ml-2">Loading Coins...</span>
                </div>
              ) : (
                filteredCryptos.map((crypto) => (
                  <div
                    key={crypto.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{crypto.symbol}</span>
                          {isWatched(crypto.id) && (
                            <Star className="w-4 h-4 fill-accent text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {crypto.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-medium">
                          ${crypto.price.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {crypto.change > 0 ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          )}
                          <span
                            className={`text-xs ${
                              crypto.change > 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {crypto.change > 0 ? "+" : ""}
                            {(crypto.change || 0).toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-muted-foreground">
                          Market Cap
                        </div>
                        <div className="text-sm font-medium">
                          ${crypto.marketCap.toLocaleString()}
                        </div>
                      </div>

                      <Button
                        variant={isWatched(crypto.id) ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleWatch(crypto.id)}
                      >
                        {isWatched(crypto.id) ? "Remove" : "Add"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
