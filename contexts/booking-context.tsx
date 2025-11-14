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
  enabled: boolean
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
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: (activeToken?: string) => Promise<void>
  loading: boolean
}

// === Config (defensive defaults) ===
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""
// REFRESH_LIFETIME should be milliseconds. If env missing -> fallback to 7 days.
const REFRESH_LIFETIME =
  Number(process.env.NEXT_PUBLIC_REFRESH_LIFETIME) || 7 * 24 * 60 * 60 * 1000

// === Helpers ===
function isAccessTokenValid(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    // protect against missing exp
    if (!decoded?.exp) return false
    return decoded.exp * 1000 > Date.now()
  } catch (err) {
    console.warn("isAccessTokenValid decode error", err)
    return false
  }
}

function isRefreshTokenValid(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded?.iat) return false
    const issuedAtMs = decoded.iat * 1000
    // if REFRESH_LIFETIME is not a number, treat as large lifetime (defensive)
    const lifetime = Number(REFRESH_LIFETIME) || 7 * 24 * 60 * 60 * 1000
    return issuedAtMs + lifetime > Date.now()
  } catch (err) {
    console.warn("isRefreshTokenValid decode error", err)
    return false
  }
}

async function refreshAccessToken(oldToken: string): Promise<string | null> {
  try {
    if (!API_BASE) {
      console.warn("API_BASE not set, cannot refresh token")
      return null
    }
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: oldToken }),
    })
    if (!res.ok) {
      console.warn("refresh token failed, status:", res.status)
      return null
    }
    const data = await res.json()
    const newToken = data.token
    if (newToken) localStorage.setItem("token", newToken)
    return newToken || null
  } catch (err) {
    console.error("Token refresh error:", err)
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

  // ========== Init ========== //
  useEffect(() => {
    const init = async () => {
      try {
        console.debug("[BookingProvider] init start")
        const savedToken = localStorage.getItem("token")
        console.debug("[BookingProvider] localStorage.token on init:", savedToken)

        if (!savedToken) {
          // nothing to do — leave logged out
          setLoading(false)
          console.debug("[BookingProvider] no token found -> not logged in")
          return
        }

        // If refresh lifetime is obviously invalid (NaN/0) we don't force logout;
        // we proceed cautiously.
        if (!isRefreshTokenValid(savedToken)) {
          console.warn("[BookingProvider] refresh lifetime expired (or invalid). Will still attempt to use access token if valid.")
          // don't call logout here (avoid wiping token during debugging)
        }

        let activeToken = savedToken

        // If the access token itself is expired, try to refresh it.
        if (!isAccessTokenValid(savedToken)) {
          console.debug("[BookingProvider] access token expired -> refreshing")
          const refreshed = await refreshAccessToken(savedToken)
          if (!refreshed) {
            console.warn("[BookingProvider] refresh failed -> will clear saved token")
            // clear token and finish
            localStorage.removeItem("token")
            setLoading(false)
            return
          }
          activeToken = refreshed
        }

        // Set the token in state (so app components can use it)
        setToken(activeToken)
        console.debug("[BookingProvider] active token set")

        // fetch user info from backend (best source of truth)
        await refreshUser(activeToken)
      } catch (err) {
        console.error("[BookingProvider] init error:", err)
      } finally {
        setLoading(false)
        console.debug("[BookingProvider] init complete")
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist token when it changes (only token, not full user)
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      console.debug("[BookingProvider] token persisted to localStorage")
    }
  }, [token])

  // ========== Login ==========
  const login = async (incomingToken: string) => {
    localStorage.setItem("token", incomingToken)
    setToken(incomingToken)

    try {
      const decoded = jwtDecode<JwtPayload>(incomingToken)
      setUser({
        id: decoded.userId,
        name: decoded.sub,
        enabled: false,
        bookings: [],
      })
    } catch (err) {
      console.warn("login: failed to decode token", err)
    }

    await refreshUser(incomingToken)
  }

  // ========== Logout ==========
  const logout = async () => {
    // optionally call backend logout endpoint (ignore errors)
    try {
      if (token && API_BASE) {
        fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }).catch((e) => console.warn("logout request failed:", e))
      }
    } catch (err) {
      console.warn("logout error calling backend:", err)
    }

    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setCurrentBooking(null)
    console.debug("[BookingProvider] logged out")
  }

  // ========== Refresh user info ==========
  const refreshUser = async (activeToken?: string) => {
    const t = activeToken || token
    if (!t) {
      console.debug("refreshUser: no token present")
      return
    }
    if (!API_BASE) {
      console.warn("refreshUser: API_BASE not set")
      return
    }

    try {
      const res = await fetch(`${API_BASE}/users/myInfo`, {
        headers: { Authorization: `Bearer ${t}` },
        cache: "no-store",
      })
      if (!res.ok) {
        console.warn("refreshUser: failed, status:", res.status)
        return
      }
      const data = await res.json()
      const info = data.result
      setUser({
        id: info.id,
        name: info.username ?? info.name ?? "unknown",
        enabled: info.enabled ?? false,
        bookings: info.bookings || [],
      })
      console.debug("refreshUser: user updated", info)
    } catch (err) {
      console.error("refreshUser error:", err)
    }
  }

  const addBooking = (booking: Booking) => {
    if (!user) return
    setUser({ ...user, bookings: [...user.bookings, booking] })
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

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within BookingProvider")
  return ctx
}
