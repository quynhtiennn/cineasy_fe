// src/components/footer.tsx
"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 text-base text-muted-foreground">
        
        {/* Left: Brand & Description */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cineasy
            </span>
          </Link>
          <p className="text-foreground/80 leading-relaxed max-w-md">
            Cineasy brings you the best movie booking experience — fast, simple, and reliable.  
            Discover new releases, book tickets effortlessly, and enjoy every moment on the big screen.
          </p>
        </div>

        {/* Right: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
          <ul className="space-y-2 text-foreground/80">
            <li>
              Email:{" "}
              <a
                href="mailto:support@cineasy.com"
                className="hover:text-foreground transition-colors"
              >
                support@cineasy.com
              </a>
            </li>
            <li>Phone: +84 123 456 789</li>
            <li>Address: 123 Movie St, Ho Chi Minh City</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Cineasy. All rights reserved.
      </div>
    </footer>
  )
}
