"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAlerts } from "@/hooks/use-alerts"
import { Plus } from "lucide-react"

const cryptoOptions = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "MATIC", name: "Polygon" },
]

export function CreateAlertButton() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    cryptoSymbol: "",
    cryptoName: "",
    type: "" as "above" | "below" | "",
    threshold: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createAlert } = useAlerts()

  const handleCryptoChange = (symbol: string) => {
    const crypto = cryptoOptions.find((c) => c.symbol === symbol)
    setFormData((prev) => ({
      ...prev,
      cryptoSymbol: symbol,
      cryptoName: crypto?.name || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.cryptoSymbol || !formData.type || !formData.threshold) {
      return
    }

    setIsSubmitting(true)

    const result = await createAlert({
      cryptoSymbol: formData.cryptoSymbol,
      cryptoName: formData.cryptoName,
      type: formData.type,
      threshold: Number.parseFloat(formData.threshold),
    })

    if (result.success) {
      setOpen(false)
      setFormData({
        cryptoSymbol: "",
        cryptoName: "",
        type: "",
        threshold: "",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crypto">Cryptocurrency</Label>
            <Select value={formData.cryptoSymbol} onValueChange={handleCryptoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Alert Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "above" | "below") => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Price goes above</SelectItem>
                <SelectItem value="below">Price goes below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Price Threshold ($)</Label>
            <Input
              id="threshold"
              type="number"
              step="0.01"
              placeholder="Enter price threshold"
              value={formData.threshold}
              onChange={(e) => setFormData((prev) => ({ ...prev, threshold: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.cryptoSymbol || !formData.type || !formData.threshold}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
