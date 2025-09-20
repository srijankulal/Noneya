import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/alerts/new">
          <Button className="w-full justify-start gap-3" variant="default">
            <Plus className="w-4 h-4" />
            Add New Alert
          </Button>
        </Link>
        <Link href="/alerts">
          <Button
            className="w-full justify-start gap-3 bg-transparent"
            variant="outline"
          >
            <Target className="w-4 h-4" />
            Manage Alerts
          </Button>
        </Link>
        <Link href="/watchlist">
          <Button
            className="w-full justify-start gap-3 bg-transparent"
            variant="outline"
          >
            <BarChart3 className="w-4 h-4" />
            Manage Watchlist
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            className="w-full justify-start gap-3 bg-transparent"
            variant="outline"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
