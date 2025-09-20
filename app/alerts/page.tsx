"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { AlertsList } from "@/components/alerts-list";
import { CreateAlertButton } from "@/components/create-alert-button";
import { useAlertMonitoring } from "@/hooks/use-alert-monitoring";

export default function AlertsPage() {
  // Enable alert monitoring on this page
  useAlertMonitoring();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-balance">Price Alerts</h1>
            <p className="text-muted-foreground">
              Manage your cryptocurrency price alerts
            </p>
          </div>
          <CreateAlertButton />
        </div>

        <AlertsList />
      </main>
    </div>
  );
}
