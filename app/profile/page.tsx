"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBooking } from "@/contexts/booking-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Ticket, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, refreshUser } = useBooking()

  const [mounted, setMounted] = useState(false)

  // dialog control
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and before hydration, render a neutral layout
  if (!mounted) {
    return <main className="container mx-auto min-h-screen px-4 py-8" />
  }


  if (!user) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold">Please log in</h2>
          <p className="mt-2 text-muted-foreground"><a href="/login">You need to log in to view your profile</a></p>
        </Card>
      </div>
    )
  }

  // open confirm dialog for a booking
  const openCancelDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setDialogOpen(true)
  }

  // confirm cancel action
  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return
    setIsCancelling(true)

    try {
      const res = await fetch(`${API_BASE}/bookings/${selectedBookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      })

      if (!res.ok) {
        // try to parse error body for helpful message
        let errMsg = "Failed to cancel booking"
        try {
          const json = await res.json()
          if (json?.message) errMsg = json.message
        } catch {
          /* ignore */
        }
        throw new Error(errMsg)
      }

      // refresh user bookings
      await refreshUser()

      toast({ title: "Booking cancelled", description: "Your booking was cancelled." })
      setDialogOpen(false)
      setSelectedBookingId(null)
    } catch (err) {
      console.error("Cancel failed:", err)
      toast({
        title: "Error",
        description: (err as Error)?.message ?? "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }


  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Profile Header */}
        <Card className="p-8">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-2xl font-bold">{user.bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bookings */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <p className="text-muted-foreground">View your ticket history</p>
            </div>
            <Link href="/">
              <Button>Book More Tickets</Button>
            </Link>
          </div>

          {user.bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No bookings yet</h3>
              <p className="mt-2 text-muted-foreground">Start booking tickets to see them here</p>
              <Link href="/">
                <Button className="mt-4">Browse Movies</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {user.bookings.map((booking, index) => (
                <Card key={index} className="p-6">
                  {/* 🔹 Top line: Booking ID (left) and Booking time (right) */}
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Booking ID: {booking.id}</span>
                    <span>
                      {new Date(booking.bookingTime).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold">{booking.movieTitle}</h3>
                        <Badge className="mt-1">{booking.bookingStatus}</Badge>
                      </div>

                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(booking.showtimeStartTime).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Ticket className="h-4 w-4" />
                          <span>{new Date(booking.showtimeStartTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            Seats:{" "}
                            {booking.tickets
                              .map((ticket) => `${ticket.rowLabel}${ticket.seatNumber}`)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">${booking.totalPrice}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.tickets.length} {booking.tickets.length === 1 ? "ticket" : "tickets"}
                      </p>
                    </div>
                  </div>
                
                  {/* 🔹 Booking action buttons */}
                  {(booking.bookingStatus === "PENDING" || booking.bookingStatus === "PAID") && (
                    <div className="flex justify-end mt-4 gap-3">
                      {booking.bookingStatus === "PENDING" && (
                        <Button
                          onClick={() => router.push(`/booking/${booking.id}`)}
                        >
                          Continue to Payment
                        </Button>
                      )}

                      {/* open alert dialog for cancellation */}
                      <AlertDialog open={dialogOpen && selectedBookingId === booking.id} onOpenChange={(open) => {
                        // close if user dismisses dialog by clicking outside
                        if (!open) {
                          setDialogOpen(false)
                          setSelectedBookingId(null)
                        }
                      }}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" onClick={() => openCancelDialog(booking.id)}>
                            Cancel Booking
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this booking? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {
                              setDialogOpen(false)
                              setSelectedBookingId(null)
                            }}>
                              Keep Booking
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmCancel}
                              disabled={isCancelling}
                            >
                              {isCancelling ? "Cancelling..." : "Yes, cancel"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
