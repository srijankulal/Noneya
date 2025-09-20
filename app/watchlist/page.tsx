import { DashboardHeader } from "@/components/dashboard-header"
import { CryptoSelector } from "@/components/crypto-selector"

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-balance">Manage Watchlist</h1>
          <p className="text-muted-foreground">Add or remove cryptocurrencies from your monitoring list</p>
        </div>

        <CryptoSelector />
      </main>
    </div>
  )
}
