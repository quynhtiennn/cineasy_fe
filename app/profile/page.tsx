"use client"

import { useBooking } from "@/contexts/booking-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Ticket, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useBooking()

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold">Please log in</h2>
          <p className="mt-2 text-muted-foreground">You need to be logged in to view your profile</p>
        </Card>
      </div>
    )
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
                  <span>{user.email}</span>
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold">{booking.movieTitle}</h3>
                        <Badge className="mt-1">Confirmed</Badge>
                      </div>

                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Ticket className="h-4 w-4" />
                          <span>{booking.showtime}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Seats: {booking.seats.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">${booking.totalPrice}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.seats.length} {booking.seats.length === 1 ? "ticket" : "tickets"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
