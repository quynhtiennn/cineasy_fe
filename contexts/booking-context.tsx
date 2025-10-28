"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import { type Ticket } from "@/lib/showtimes-data"

// === Types ===
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

interface JwtPayload {
  sub: string
  userId: number
  exp: number
  iat: number
}

interface BookingContextType {
  user: User | null
  token: string | null
  currentBooking: Partial<Booking> | null
  setCurrentBooking: (booking: Partial<Booking> | null) => void
  addBooking: (booking: Booking) => void
  login: (username: string, token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  loading: boolean
}

// === Config ===
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const REFRESH_LIFETIME = Number(process.env.NEXT_PUBLIC_REFRESH_LIFETIME || 24 * 60 * 60 * 1000)

// === Helpers ===
function isAccessTokenValid(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

function isRefreshTokenValid(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const issuedAtMs = decoded.iat * 1000
    const refreshExpiry = issuedAtMs + REFRESH_LIFETIME
    return refreshExpiry > Date.now()
  } catch {
    return false
  }
}

async function refreshAccessToken(oldToken: string): Promise<string | null> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
    console.log("API_BASE =", API_BASE)
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: oldToken }),
    })
    if (!res.ok) throw new Error("Failed to refresh token")
    const data = await res.json()
    const newToken = data.token
    localStorage.setItem("token", newToken)
    return newToken
  } catch (err) {
    console.error("Token refresh failed:", err)
    return null
  }
}

// === Context ===
const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)
  const [loading, setLoading] = useState(true)

  // === Initialize from localStorage ===
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const savedUser = localStorage.getItem("user")
      const savedToken = localStorage.getItem("token")

      if (!savedToken || !savedUser) {
        setLoading(false)
        return
      }

      const tokenValid = isAccessTokenValid(savedToken)
      const refreshValid = isRefreshTokenValid(savedToken)

      // both expired
      if (!refreshValid) {
        logout()
        setLoading(false)
        return
      }

      // access expired but refresh valid
      let newToken = savedToken
      if (!tokenValid) {
        const refreshed = await refreshAccessToken(savedToken)
        if (refreshed) {
          newToken = refreshed
          setToken(refreshed)
        } else {
          logout()
          setLoading(false)
          return
        }
      } else {
        setToken(savedToken)
      }

      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch {
        localStorage.removeItem("user")
      }

      // fetch latest user info (ensure bookings are current)
      await refreshUser(newToken)
      setLoading(false)
    }

    init()
  }, [])

  // === Persist user/token changes ===
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)
    }
  }, [user, token])

  // === Login ===
  const login = async (username: string, token: string) => {
    setToken(token)
    const decoded = jwtDecode<JwtPayload>(token)
    const basicUser: User = { id: decoded.userId, name: decoded.sub, bookings: [] }
    setUser(basicUser)

    await refreshUser(token)
  }

  // === Logout ===
  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })
      } catch (err) {
        console.error("Failed to log out:", err)
      }
    }

    // Clear everything on the client side
    setUser(null)
    setToken(null)
    setCurrentBooking(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }


  // === Refresh user info ===
  const refreshUser = async (activeToken?: string) => {
    const t = activeToken || token
    if (!t) return
    try {
      const res = await fetch(`${API_BASE}/users/myInfo`, {
        headers: { Authorization: `Bearer ${t}` },
        cache: "no-store",
      })
      if (res.ok) {
        const data = await res.json()
        const info = data.result
        setUser({
          id: info.id,
          name: info.username || info.name,
          bookings: info.bookings || [],
        })
      } else {
        console.error("Failed to refresh user:", res.status)
      }
    } catch (err) {
      console.error("Error refreshing user:", err)
    }
  }

  const addBooking = (booking: Booking) => {
    if (user) {
      setUser({ ...user, bookings: [...user.bookings, booking] })
    }
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
        refreshUser,
        loading,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

// === Hook ===
export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider")
  return ctx
}
