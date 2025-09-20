import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationSettings } from "@/components/notification-settings"
import { NotificationCenter } from "@/components/notification-center"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground">Manage your notification preferences and app settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotificationSettings />
          <NotificationCenter />
        </div>
      </main>
    </div>
  )
}
