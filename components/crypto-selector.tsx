"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Star, TrendingUp, TrendingDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock cryptocurrency data
const availableCryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 43250.0, change: 2.45, marketCap: "845B", isWatched: true },
  { symbol: "ETH", name: "Ethereum", price: 2680.5, change: -1.23, marketCap: "322B", isWatched: true },
  { symbol: "BNB", name: "BNB", price: 315.8, change: 1.87, marketCap: "47B", isWatched: false },
  { symbol: "SOL", name: "Solana", price: 98.75, change: 5.67, marketCap: "43B", isWatched: true },
  { symbol: "XRP", name: "XRP", price: 0.615, change: -2.14, marketCap: "33B", isWatched: false },
  { symbol: "ADA", name: "Cardano", price: 0.485, change: -0.89, marketCap: "17B", isWatched: true },
  { symbol: "AVAX", name: "Avalanche", price: 37.2, change: 3.45, marketCap: "14B", isWatched: false },
  { symbol: "DOT", name: "Polkadot", price: 7.85, change: 1.23, marketCap: "10B", isWatched: false },
  { symbol: "LINK", name: "Chainlink", price: 15.4, change: 2.67, marketCap: "9B", isWatched: false },
  { symbol: "MATIC", name: "Polygon", price: 0.89, change: -1.45, marketCap: "8B", isWatched: false },
]

export function CryptoSelector() {
  const [searchTerm, setSearchTerm] = useState("")
  const [watchedCryptos, setWatchedCryptos] = useState(availableCryptos.filter((crypto) => crypto.isWatched))

  const filteredCryptos = availableCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleWatch = (symbol: string) => {
    const crypto = availableCryptos.find((c) => c.symbol === symbol)
    if (crypto) {
      crypto.isWatched = !crypto.isWatched
      setWatchedCryptos(availableCryptos.filter((c) => c.isWatched))
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchedCryptos.map((crypto) => (
              <div key={crypto.symbol} className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{crypto.symbol}</span>
                    <Star className="w-4 h-4 fill-accent text-accent" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWatch(crypto.symbol)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{crypto.name}</p>
                <div className="space-y-1">
                  <div className="text-lg font-bold font-mono">${crypto.price.toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    {crypto.change > 0 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs ${crypto.change > 0 ? "text-success" : "text-destructive"}`}>
                      {crypto.change > 0 ? "+" : ""}
                      {crypto.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Cryptocurrency */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full gap-2">
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
              {filteredCryptos.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{crypto.symbol}</span>
                        {crypto.isWatched && <Star className="w-4 h-4 fill-accent text-accent" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{crypto.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-medium">${crypto.price.toLocaleString()}</div>
                      <div className="flex items-center gap-1">
                        {crypto.change > 0 ? (
                          <TrendingUp className="w-3 h-3 text-success" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        )}
                        <span className={`text-xs ${crypto.change > 0 ? "text-success" : "text-destructive"}`}>
                          {crypto.change > 0 ? "+" : ""}
                          {crypto.change}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Market Cap</div>
                      <div className="text-sm font-medium">${crypto.marketCap}</div>
                    </div>

                    <Button
                      variant={crypto.isWatched ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleWatch(crypto.symbol)}
                    >
                      {crypto.isWatched ? "Remove" : "Add"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
