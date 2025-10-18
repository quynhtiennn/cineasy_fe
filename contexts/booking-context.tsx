  "use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Booking {
  movieId: string
  movieTitle: string
  showtime: string
  date: string
  seats: string[]
  totalPrice: number
}

interface User {
  name: string
  email: string
  bookings: Booking[]
}

interface BookingContextType {
  user: User | null
  currentBooking: Partial<Booking> | null
  setCurrentBooking: (booking: Partial<Booking> | null) => void
  addBooking: (booking: Booking) => void
  login: (name: string, email: string) => void
  logout: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "Guest User",
    email: "guest@cinemax.com",
    bookings: [],
  })
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)

  const addBooking = (booking: Booking) => {
    if (user) {
      setUser({
        ...user,
        bookings: [...user.bookings, booking],
      })
    }
  }

  const login = (name: string, email: string) => {
    setUser({
      name,
      email,
      bookings: [],
    })
  }

  const logout = () => {
    setUser(null)
    setCurrentBooking(null)
  }

  return (
    <BookingContext.Provider value={{ user, currentBooking, setCurrentBooking, addBooking, login, logout }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
