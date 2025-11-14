"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useBooking } from "@/contexts/booking-context"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const { login } = useBooking()

  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      const url = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/users`
      const body = JSON.stringify({ username, password })

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || (isLogin ? "Login failed" : "Sign up failed"))

      // Signup: always go to confirm email
      if (!isLogin) {
        router.push("/confirm-email")
        return
      }

      // Login flow
      const token = data.result?.token

      // No token → not enabled
      if (!token) {
        router.push("/confirm-email")
        return
      }

      // Token exists → enabled → save and login
      localStorage.setItem("token", token)
      await login(token)

      router.push(redirect)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 px-4">
      <Card className="w-full max-w-md border-border/50 bg-background/50 backdrop-blur">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            {isLogin
              ? "Sign in to book your tickets"
              : "Sign up to start booking tickets"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              type="text"
              placeholder="Email"
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

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading
                ? isLogin
                  ? "Signing in..."
                  : "Signing up..."
                : isLogin
                ? "Log In"
                : "Sign Up"}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            {isLogin ? (
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-primary hover:underline"
              >
                Forgot password?
              </button>
            ) : (
              <div />
            )}

            <div>
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
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
