import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Noneya - Cryptocurrency Price Monitoring Dashboard",
  description: "Stay ahead. Alerted. Invested.",
  icons: {
    icon: [
      { url: "/none.ico", sizes: "any" },
      { url: "/none.png", type: "image/png" },
    ],
    shortcut: "/none.ico",
    apple: "/none.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
