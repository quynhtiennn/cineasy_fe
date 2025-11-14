"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useBooking } from "@/contexts/booking-context" 

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { login } = useBooking() // ✅ get context updater

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Missing verification token.")
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok || !data?.result?.enabled) {
          throw new Error(data?.message || "Invalid or expired verification link.")
        }

        localStorage.setItem("token", data.result.token)

        const jwt = data.result.token
        await login(jwt)

        setStatus("success")
        setMessage("Your email has been verified and you’re now logged in!")

      } catch (err) {
        console.error(err)
        setStatus("error")
        setMessage("Verification link is not valid or has expired.")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 px-4">
      <Card className="p-8 text-center max-w-md w-full bg-background/60 backdrop-blur border border-border/50">
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin w-10 h-10 mx-auto text-primary" />
            <p className="mt-4 text-lg">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-10 h-10 mx-auto text-green-500" />
            <p className="mt-4 text-lg font-semibold">{message}</p>
            <Button className="mt-6 w-full" onClick={() => router.push("/")}>
              Go to Home
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-4 text-lg font-medium">{message}</p>
            <Button className="mt-6 w-full" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
