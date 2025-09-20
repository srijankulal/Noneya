import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Bell, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Bitcoin,
  DollarSign,
  Clock
} from "lucide-react";
import nono from "@/public/none.png"
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
     
        <Image src={nono} alt="Noneya Logo" width={24} height={24} className="text-accent-foreground" />


            </div>
            <span className="text-xl font-bold">Noneya</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Real-time Monitoring
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Stay Ahead. <span className="text-primary">Alerted.</span> Invested.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Never miss a market opportunity. Get instant alerts when your favorite cryptocurrencies 
            hit your target prices. Monitor, analyze, and act with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                <TrendingUp className="w-5 h-5 mr-2" />
                Start Monitoring
              </Button>
            </Link>
            <Link href="/alerts">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Bell className="w-5 h-5 mr-2" />
                Set Up Alerts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to stay informed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and intelligent alerts to help you make better investment decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Smart Price Alerts</CardTitle>
              <CardDescription>
                Set custom price thresholds and get instant notifications via browser, email, or push notifications
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-time Charts</CardTitle>
              <CardDescription>
                Interactive price charts with historical data and trend analysis for informed decision making
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Multi-Platform Notifications</CardTitle>
              <CardDescription>
                Receive alerts on any device - desktop browser notifications, mobile push, and email alerts
              </CardDescription>
            </CardHeader>
          </Card>

         
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to take control of your crypto investments?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of traders who never miss an opportunity
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              <TrendingUp className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <Bitcoin className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Noneya</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Noneya. Stay ahead. Alerted. Invested.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
