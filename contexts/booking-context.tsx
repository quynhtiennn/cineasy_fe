"use client"

import { type Ticket } from "@/lib/showtimes-data"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode"

interface Booking {
  id: string
  bookingTime: string
  totalPrice: number
  movieTitle: string
  showtimeStartTime: string
  bookingStatus: string
  tickets: Ticket[]
}

interface User {
  id: number
  name: string
  bookings: Booking[]
}

interface BookingContextType {
  user: User | null
  token: string | null
  currentBooking: Partial<Booking> | null
  setCurrentBooking: (booking: Partial<Booking> | null) => void
  addBooking: (booking: Booking) => void
  login: (username: string, password: string, isSignup?: boolean) => Promise<void>
  logout: () => void
}

interface JwtPayload {
  sub: string  
  userId: number
  exp: number

}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)

  // 🔹 Load user and token from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
    }
  }, [])

  // 🔹 Persist user & token whenever they change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }, [user, token])

  // 🔹 Add booking for current user
  const addBooking = (booking: Booking) => {
    if (user) {
      const updatedUser = {
        ...user,
        bookings: [...user.bookings, booking],
      }
      setUser(updatedUser)
    }
  }

  // 🔹 Login or signup
const login = async (username: string, token: string) => {

  setToken(token)
  const decoded = jwtDecode<JwtPayload>(token)
  const basicUser: User = {
    id: decoded.userId,
    name: decoded.sub,
    bookings: [],
  }
  setUser(basicUser)

  // Optional: fetch verified info
  try {
    const infoRes = await fetch("http://localhost:8080/users/myInfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (infoRes.ok) {
      const data = await infoRes.json()
      const info = data.result
      console.log("Fetched user info:", info)
      setUser({
        id: info.id,
        name: info.username || decoded.sub,
        bookings: info.bookings || [],
      })
    }
  } catch (err) {
    console.error("Failed to fetch /users/myInfo", err)
  }
}

  // 🔹 Logout
  const logout = () => {
    setUser(null)
    setToken(null)
    setCurrentBooking(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <BookingContext.Provider
      value={{
        user,
        token,
        currentBooking,
        setCurrentBooking,
        addBooking,
        login,
        logout,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

/* "use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Booking {
  tickets: string[]
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
  const [user, setUser] = useState<User | null>(null)
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)

  // 🔹 Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // 🔹 Save or remove user in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const addBooking = (booking: Booking) => {
    if (user) {
      const updatedUser = {
        ...user,
        bookings: [...user.bookings, booking],
      }
      setUser(updatedUser)
    }
  }

  const login = (name: string, email: string) => {
    const newUser: User = {
      name,
      email,
      bookings: [],
    }
    setUser(newUser)
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
} */


/*   "use client"

import { StringDecoder } from "node:string_decoder"
import { createContext, useContext, useState, type ReactNode } from "react"

interface Booking {
  tickets: string[]
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
 */