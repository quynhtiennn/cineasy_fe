import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { BookingProvider } from "@/contexts/booking-context"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Cineasy - Book Your Movie Tickets",
  description: "Premium movie ticket booking experience",
  icons: {
    icon: "/logo.svg", 
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
            <BookingProvider>
              <Suspense fallback={null}>
                <Navigation />
                {children}
              </Suspense>
            </BookingProvider>
        <Analytics />
      </body>
    </html>
  )
}
