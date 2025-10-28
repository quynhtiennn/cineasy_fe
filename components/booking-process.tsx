"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function BookingPage({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const { user, token, refreshUser  } = useBooking()

  const [bookingStatus, setBookingStatus] = useState<"PENDING" | "PAID" | "CANCELLED" | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  // Fetch booking info
  useEffect(() => {

  if (!user) {
    router.push(`/login?redirect=/booking/${bookingId ?? ""}`)
    return
  }

  if (!bookingId || !token) {
    return
  }

  const fetchBooking = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch booking")

      const data = await res.json()
      const booking = data.result

      setBookingStatus(booking.bookingStatus) // expecting "PENDING" | "PAID" | "CANCELLED"
    } catch (err) {
      console.error(err)
      alert("Unable to load booking details.")
    } finally {
      setLoading(false)
    }
  }

  fetchBooking()
}, [user, token, bookingId, router])


  // ✅ Payment handler
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return router.push(`/login?redirect=/booking/${bookingId}`)
    if (bookingStatus !== "PENDING") return

    try {
      setProcessing(true)

      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "PAID" }),
      })

      if (!res.ok) throw new Error("Payment failed")

      setBookingStatus("PAID")
      await refreshUser()  
    } catch (err) {
      console.error(err)
      alert("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading booking details...</p>
      </div>
    )
  }

  // Already paid
  if (bookingStatus === "PAID") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="mt-2 text-muted-foreground">
            Your booking has already been paid and confirmed.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/profile")}>View My Bookings</Button>
          </div>
        </Card>
      </div>
    )
  }

  // Cancelled booking
  if (bookingStatus === "CANCELLED") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Booking Cancelled</h2>
          <p className="mt-2 text-muted-foreground">
            This booking has been cancelled and cannot be paid.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Payment form (only for PENDING)
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Details</h1>

      <Card className="p-6 max-w-lg mx-auto">
        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                placeholder="MM/YY"
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                placeholder="123"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
