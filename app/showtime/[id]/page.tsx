"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { type Ticket, type Showtime } from "@/lib/showtimes-data"
import { useBooking } from "@/contexts/booking-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft} from "lucide-react"
import Link from "next/link"
import Loading from "./loading"
import LoadingIcon from "@/components/loading-icon"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL 

export default function ShowtimePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user, token, logout, refreshUser } = useBooking()
  const [showtime, setShowtime] = useState<Showtime | null>(null)
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const { id } = use(params)

  //  LOGIN CHECK
  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/showtime/${id}`)
    }
  }, [user, router, id])

  //  FETCH SHOWTIME with Authorization header
  useEffect(() => {
    const fetchShowtime = async () => {
      try {
        const res = await fetch(`${API_BASE}/showtimes/${id}`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        })

        if (res.status === 401) {
          // token invalid or expired
          logout()
          router.push(`/login?redirect=/showtime/${id}`)
          return
        }

        if (!res.ok) throw new Error("Failed to fetch showtime")

        const data = await res.json()
        const showtimeData = data.result || data

        setShowtime(showtimeData)

        const seats = showtimeData.tickets
          .filter((t: Ticket) => !t.available)
          .map((t: Ticket) => `${t.rowLabel}${t.seatNumber}`)
        setOccupiedSeats(seats)
      } catch (err) {
        console.error("Error fetching showtime:", err)
      }
    }

    if (user) fetchShowtime()
  }, [id, user, token, logout, router])

  if (!showtime) return <LoadingIcon />

  const totalRows = showtime.totalRows
  const ROWS = Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i))
  const SEATS_PER_ROW = showtime.seatsPerRow

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    )
  }

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const ticket = showtime.tickets.find((t: Ticket) => `${t.rowLabel}${t.seatNumber}` === seatId)
    return total + (ticket ? ticket.price : 0)
  }, 0)

  // Create booking before payment
  const handleCreateBooking = async () => {
    if (!user) return router.push(`/login?redirect=/showtime/${id}`)

    try {
      const selectedTicketIds = showtime.tickets
        .filter((t) => selectedSeats.includes(`${t.rowLabel}${t.seatNumber}`))
        .map((t) => t.id)

      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tickets: selectedTicketIds,
        }),
      })

      if (res.status === 401) {
        logout()
        router.push(`/login?redirect=/showtime/${id}`)
        return
      }

      if (!res.ok) throw new Error("Failed to create booking")

      const data = await res.json()
      const booking = data.result
      
      await refreshUser()

      router.push(`/booking/${booking.id}`)
    } catch (err) {
      console.error("Booking error:", err)
      alert("Could not create booking. Please try again.")
    }
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <Link href={`/movie/${showtime.movieId}`}>
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Movie
        </Button>
      </Link>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{showtime.movieTitle}</h1>
          <p className="text-muted-foreground">
            {new Date(showtime.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} 
            • 
            {new Date(showtime.startTime).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Select Your Seats</h2>

                {/* Legend */}
                <div className="mb-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded border-2 border-border bg-background" />
                    <span className="text-muted-foreground">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary" />
                    <span className="text-muted-foreground">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-muted" />
                    <span className="text-muted-foreground">Occupied</span>
                  </div>
                </div>

                {/* Screen */}
                <div className="mb-8">
                  <div className="mx-auto h-2 w-3/4 rounded-t-full bg-gradient-to-b from-primary/50 to-transparent" />
                  <p className="mt-2 text-center text-xs text-muted-foreground">SCREEN</p>
                </div>

                {/* Seats Grid */}
                <div className="space-y-3">
                  {ROWS.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-2">
                      <span className="w-6 text-center text-sm font-medium text-muted-foreground">{row}</span>
                      <div className="flex gap-2">
                        {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                          const seatId = `${row}${i + 1}`
                          const isOccupied = occupiedSeats.includes(seatId)
                          const isSelected = selectedSeats.includes(seatId)

                          return (
                            <button
                              key={seatId}
                              type="button"
                              onClick={() => toggleSeat(seatId)}
                              disabled={isOccupied}
                              className={`h-8 w-8 rounded text-xs font-medium transition-all ${
                                isOccupied
                                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                                  : isSelected
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "border-2 border-border bg-background hover:border-primary"
                              }`}
                            >
                              {i + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

                {/* Booking Summary */}
          <div>
            <Card className="sticky top-20 p-6">
              <h3 className="mb-4 font-semibold">Booking Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{showtime.movieTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(showtime.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} 
                      • 
                      {new Date(showtime.startTime).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Selected Seats</span>
                      <span className="font-medium">{selectedSeats.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Number of Tickets</span>
                      <span>{selectedSeats.length}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between border-t border-border pt-4 font-semibold">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={selectedSeats.length === 0}
                  onClick={handleCreateBooking}
                >
                  Continue to Payment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
