"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)

  // Verify token on load
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.")
      setIsTokenValid(false)
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-password-reset-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (res.ok) {
          setIsTokenValid(true)
        } else {
          const data = await res.json().catch(() => ({}))
          setError(data?.message || "Reset link is invalid or expired.")
          setIsTokenValid(false)
        }
      } catch (err) {
        console.error(err)
        setError("Network error. Please try again later.")
        setIsTokenValid(false)
      }
    }

    verifyToken()
  }, [token])

  // Handle password reset
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!password || !confirmPassword) {
      setError("Please fill out all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setMessage("Password reset successful! You can now log in.")
        setTimeout(() => router.push("/login"), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data?.message || "Failed to reset password.")
      }
    } catch (err) {
      console.error(err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border border-gray-800 bg-neutral-900 text-white">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Reset your password</h1>
          </div>

          {/* Loading or verifying token */}
          {isTokenValid === null && (
            <p className="text-gray-400">Verifying your reset link...</p>
          )}

          {/* Invalid token */}
          {isTokenValid === false && (
            <div className="text-red-500 bg-red-500/10 p-4 rounded">
              {error || "Invalid or expired reset link."}
            </div>
          )}

          {/* Valid token -> show reset form */}
          {isTokenValid && (
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-gray-700 text-white placeholder-gray-500"
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-neutral-800 border-gray-700 text-white placeholder-gray-500"
              />

              {error && (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-sm text-green-500 bg-green-500/10 p-3 rounded">
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                {isLoading ? "Resetting..." : "Confirm New Password"}
              </Button>
            </form>
          )}

          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="w-full mt-3 border-gray-700 text-white hover:bg-neutral-800"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  )
}
