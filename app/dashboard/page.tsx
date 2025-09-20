"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { CryptoOverview } from "@/components/crypto-overview";
import { ActiveAlerts } from "@/components/active-alerts";
import { PriceChart } from "@/components/price-chart";
import { QuickActions } from "@/components/quick-actions";
import { PriceMonitor } from "@/components/price-monitor";
import { CryptoNews } from "@/components/CryptoNews";
import { useAlertMonitoring } from "@/hooks/use-alert-monitoring";

export default function Dashboard() {
  const watchedSymbols = ["BTC", "ETH", "SOL", "ADA"];

  useAlertMonitoring();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <CryptoOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <PriceChart />
            <CryptoNews />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            <PriceMonitor watchedSymbols={watchedSymbols} />
            <ActiveAlerts />
          </div>
        </div>
      </main>
    </div>
  );
}