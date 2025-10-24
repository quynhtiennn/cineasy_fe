"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Film } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

export default function AuthPage() {
  const router = useRouter()
  const { login } = useBooking() // store token or user info here

  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Replace with your actual API base URL
  const API_BASE_URL = "http://localhost:8080/api/auth"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password || (!isLogin && !confirmPassword)) {
      setError("Please fill in all fields")
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || "Authentication failed")
      }

      const data = await res.json()
      const token = data.result.token || null

      if (!token) {
        throw new Error("No token returned from server")
      }

      // ✅ Store JWT (choose one)
      localStorage.setItem("token", token) // keeps user logged in even after reload
      login(username, token) // update your context if needed

      // ✅ Redirect to previous page or homepage
      if (document.referrer && document.referrer.includes(window.location.origin)) {
        router.back()
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message || "Server error. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 px-4">
      <Card className="w-full max-w-md border-border/50 bg-background/50 backdrop-blur">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CineMax
            </h1>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-muted-foreground text-center mb-6">
            {isLogin ? "Sign in to book your tickets" : "Sign up to start booking tickets"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              type="text"
              placeholder="Email or Phone number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background/50 border-border/50"
            />

            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-border/50"
            />

            {!isLogin && (
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            )}

            {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (isLogin ? "Signing in..." : "Signing up...") : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}
