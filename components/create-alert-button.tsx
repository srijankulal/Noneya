"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlerts } from "@/hooks/use-alerts";
import { useNotifications } from "@/hooks/use-notifications";
import { Plus } from "lucide-react";

interface CryptoOption {
  id: string;
  symbol: string;
  name: string;
}

export function CreateAlertButton() {
  const [open, setOpen] = useState(false);
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCryptoId, setSelectedCryptoId] = useState("");
  const [formData, setFormData] = useState({
    cryptoSymbol: "",
    cryptoName: "",
    type: "" as "above" | "below" | "",
    threshold: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createAlert } = useAlerts();
  const { requestPermission, permission } = useNotifications();

  // Request notification permission when component mounts
  useEffect(() => {
    if (permission === "default") {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    async function fetchCryptos() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch crypto data");
        }
        const data: CryptoOption[] = await response.json();
        setCryptoOptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (open) fetchCryptos();
  }, [open]);

  const handleCryptoChange = (id: string) => {
    const crypto = cryptoOptions.find((c) => c.id === id);
    setFormData((prev) => ({
      ...prev,
      cryptoSymbol: crypto?.symbol.toUpperCase() || "",
      cryptoName: crypto?.name || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cryptoSymbol || !formData.type || !formData.threshold) return;

    setIsSubmitting(true);
    const result = await createAlert({
      cryptoSymbol: formData.cryptoSymbol,
      cryptoName: formData.cryptoName,
      type: formData.type,
      threshold: Number.parseFloat(formData.threshold),
    });

    if (result.success) {
      setOpen(false);
      setSelectedCryptoId("");
      setFormData({
        cryptoSymbol: "",
        cryptoName: "",
        type: "",
        threshold: "",
      });
    }
    setIsSubmitting(false);
  };

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
            <Select
              value={selectedCryptoId}
              onValueChange={(id) => {
                setSelectedCryptoId(id);
                handleCryptoChange(id);
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? "Loading coins..." : "Select cryptocurrency"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Alert Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "above" | "below") =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, threshold: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.cryptoSymbol ||
                !formData.type ||
                !formData.threshold
              }
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
