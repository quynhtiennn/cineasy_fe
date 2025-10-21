"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getShowtimeById , type Ticket } from "@/lib/showtimes-data"
import { useBooking } from "@/contexts/booking-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Check } from "lucide-react"
import Link from "next/link"


export default function BookingPage({ params }: { params: { id: number } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showtimeId = searchParams.get("showtime")
  const { addBooking, user } = useBooking()

  const showtime = useState<null | Awaited<ReturnType<typeof getShowtimeById>>>(null)[0];

  useEffect(() => {
    if (showtimeId) {
      getShowtimeById(Number(showtimeId))
        .then((data) => {
          showtime[1](data);
        })
        .catch(() => {
          router.replace("/");
        });
    } else {
      router.replace("/");
    }
  }, [showtimeId, router, showtime]);



  const totalRows = showtime.totalRows;
  const ROWS = Array.from({ length: totalRows }, (_, i) =>
              String.fromCharCode(65 + i));
  const SEATS_PER_ROW = showtime.seatsPerRow;


  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [step, setStep] = useState<"seats" | "payment" | "confirmation">("seats")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  // Determine occupied seats from showtime tickets
  const [occupiedSeats] = useState<string[]>(() => {
    if (!showtime || !showtime.tickets) return [];
  return showtime.tickets
    .filter((t: Ticket) => !t.available)
    .map((t: Ticket) => `${t.rowLabel}${t.seatNumber}`);
  })

  if (!showtime) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold">Booking not found</h2>
          <p className="mt-2 text-muted-foreground">Please select a valid showtime</p>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return

    setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]))
  }

  const totalPrice = selectedSeats.reduce((total, seatId) => {
  const ticket = showtime.tickets.find(
    (t: Ticket) => `${t.rowLabel}${t.seatNumber}` === seatId
  );
  return total + (ticket ? ticket.price : 0);
}, 0);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate payment processing
    setTimeout(() => {
      addBooking({
        tickets: selectedSeats,
      })
      setStep("confirmation")
    }, 1000)
  }

  if (step === "confirmation") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p className="mt-2 text-muted-foreground">Your tickets have been booked successfully</p>

          <div className="mt-6 space-y-2 rounded-lg bg-muted p-4 text-left">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Movie</span>
              <span className="text-sm font-medium">{showtime.movieTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Showtime</span>
              <span className="text-sm font-medium">{showtime.startTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Seats</span>
              <span className="text-sm font-medium">{selectedSeats.join(", ")}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-bold">${totalPrice}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                View Bookings
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (step === "payment") {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => setStep("seats")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Seat Selection
        </Button>

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold">Payment Details</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    <CreditCard className="h-4 w-4" />
                    Pay ${totalPrice}
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20 p-6">
                <h3 className="mb-4 font-semibold">Order Summary</h3>
                <div className="space-y-3">
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

                  <div className="space-y-1 border-t border-border pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seats</span>
                      <span>{selectedSeats.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tickets</span>
                      <span>
                      ${selectedSeats.reduce((total, seatId) => {
                        const ticket = showtime.tickets.find(
                          (t: any) => `${t.rowLabel}${t.seatNumber}` === seatId
                        );
                        return total + (ticket ? ticket.price : showtime.price ?? 0);
                      }, 0)}
                    </span>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-border pt-3 font-semibold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <Link href={`/movies/${showtime.movieId}`}>
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
                      <span className="text-muted-foreground">Tickets</span>
                      <span>
                      ${selectedSeats.reduce((total, seatId) => {
                        const ticket = showtime.tickets.find(
                          (t: any) => `${t.rowLabel}${t.seatNumber}` === seatId
                        );
                        return total + (ticket ? ticket.price : showtime.price ?? 0);
                      }, 0)}
                    </span>
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
                  onClick={() => setStep("payment")}
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
