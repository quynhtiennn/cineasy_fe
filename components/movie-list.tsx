"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

type Movie = {
  id: string | number
  title: string
  posterUrl?: string
  backdropUrl?: string
  description?: string
  duration?: number
  rating?: string
  genre?: string // e.g. "Sci-Fi, Adventure, Drama"
  releaseDate: string // ISO date string
}

export default function MovieList({ movies }: { movies: Movie[] }) {
  // keep default status as "Now Showing" (as you wanted),
  // but make default genre match the option we create ("All Genres")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")
  const [selectedStatus, setSelectedStatus] = useState("Now Showing")

  // Extract unique genres safely and produce "All Genres" first
  const genres = useMemo(() => {
    const allGenres = movies.flatMap((m) =>
      (m.genre || "")
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
    )
    const unique = Array.from(new Set(allGenres))
    unique.sort() // optional alphabetical order
    return ["All Genres", ...unique]
  }, [movies])

  // Filter movies based on genre and release date
  const filteredMovies = useMemo(() => {
    const now = new Date()

    return movies.filter((movie) => {
      // guard: if releaseDate missing or invalid, treat as "coming soon"
      const releaseDate = movie.releaseDate ? new Date(movie.releaseDate) : null
      const isNowShowing = releaseDate ? releaseDate <= now : false
      const isComingSoon = releaseDate ? releaseDate > now : true

      const matchStatus =
        selectedStatus === "All Movies" ||
        (selectedStatus === "Now Showing" && isNowShowing) ||
        (selectedStatus === "Coming Soon" && isComingSoon)

      const movieGenres = (movie.genre || "")
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)

      const matchGenre =
        selectedGenre === "All Genres" || movieGenres.includes(selectedGenre)

      return matchStatus && matchGenre
    })
  }, [movies, selectedGenre, selectedStatus])

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">{selectedStatus}</h2>
          <p className="text-muted-foreground">
            {selectedStatus === "Now Showing"
              ? "Book your tickets for the latest releases"
              : "Upcoming movies you don’t want to miss"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-md border border-white bg-background px-3 py-2 text-base text-white"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-white bg-background px-3 py-2 text-base text-white"
          >
            <option value="All Movies">All Movies</option>
            <option value="Now Showing">Now Showing</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
      </div>

      {/* Movie Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <Card className="group overflow-hidden transition-all hover:scale-105 hover:shadow-xl">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform group-hover:translate-y-0">
                  <Button className="w-full" size="sm">
                    Book Now
                  </Button>
                </div>
              </div>

              <div className="space-y-2 p-4">
                <h3 className="font-semibold leading-tight">{movie.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration} min</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {movie.rating}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(movie.genre || "")
                    .split(",")
                    .map((g) => g.trim())
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((g) => (
                      <Badge key={g} variant="secondary" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {filteredMovies.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center">No movies found.</p>
        )}
      </div>
    </section>
  )
}
