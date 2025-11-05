"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setMessage("A reset link has been sent to your email address.")
      } else {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to send reset link.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong. Please check your email.")
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
            <h1 className="text-2xl font-bold">Forgot your password?</h1>
          </div>
          <p className="text-gray-400 mb-6">
            Enter the email associated with your account, and we’ll send a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

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
