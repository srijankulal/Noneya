import { Bell, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import none from"@/public/none.png";
import Image from "next/image";

export function DashboardHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
    <Link href="/" className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
        <Image src={none} alt="Noneya Logo" width={24} height={24} className="text-accent-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-balance">Noneya</h1>
        <p className="text-sm text-muted-foreground">
          Curated Crypto Content
        </p>
      </div>
    </Link>

          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/watchlist">
              <Button variant="ghost">Watchlist</Button>
            </Link>
            <Link href="/alerts">
              <Button variant="ghost">Alerts</Button>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/alerts">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
