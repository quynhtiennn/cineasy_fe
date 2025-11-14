"use client"

import { BookingProvider } from "@/contexts/booking-context"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}
