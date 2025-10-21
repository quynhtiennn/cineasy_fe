/* "use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/contexts/booking-context"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useBooking()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Film className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CineMax</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Movies
          </Link>

          <Link href="/profile">
            <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {user?.name || "Profile"}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
 */
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Film, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/contexts/booking-context"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useBooking()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isLoggedIn = user && user.email !== "guest@cinemax.com"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Film className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CineMax</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Movies
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name}
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/profile">
                <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Guest
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
