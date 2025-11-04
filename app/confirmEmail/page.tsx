"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/auth/resend-verification?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      )

      if (res.ok) {
        setMessage("Verification email has been resent. Please check your inbox.")
      } else {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to resend verification email.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong. Please check your email.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 px-4">
      <Card className="w-full max-w-md border-border/50 bg-background/50 backdrop-blur">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Confirm your email</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            We’ve sent a verification link to your email.  
            Please check your inbox (and spam folder) to verify your account.
          </p>

          <form onSubmit={handleResend} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email to resend link"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-border/50"
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
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          </form>

          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="w-full mt-3"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  )
}
