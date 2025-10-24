"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/contexts/booking-context"

export default function ShowtimeList({ showtimes }: { showtimes: any[] }) {
  const router = useRouter()
  const { user } = useBooking() // assume you store user/token here

  const handleSelect = (showtimeId: number) => {
    if (!user) {
      // not logged in → redirect to login
      router.push(`/login?redirect=/showtime/${showtimeId}`)
    } else {
      // logged in → go to booking page
      router.push(`/showtime/${showtimeId}`)
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {showtimes.map((s) => (
        <Card
          key={s.id}
          className="group cursor-pointer p-6 transition-all hover:scale-105 hover:border-primary hover:shadow-lg"
          onClick={() => handleSelect(s.id)}
        >
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {new Date(s.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(s.startTime).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-1 border-t border-border pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">from ${s.minPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span
                  className={
                    s.availableCount < 20
                      ? "text-destructive"
                      : "text-green-500"
                  }
                >
                  {s.availableCount} seats
                </span>
              </div>
            </div>

            <Button className="w-full" size="sm">
              Select
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
