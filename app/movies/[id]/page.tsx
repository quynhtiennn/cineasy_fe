import { notFound } from "next/navigation"
import Link from "next/link"
import { getMovieById } from "@/lib/movies-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Star, User } from "lucide-react"

export default function MovieDetailPage({ params }: { params: { id: string } }) {

  const movie = getMovieById(params.id)

  if (!movie) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      {/* Movie Header */}
      <section className="relative h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${movie.backdrop}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
        </div>

        <div className="container relative mx-auto flex h-full items-end px-4 pb-12">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full md:w-64 lg:w-80">
              <Card className="overflow-hidden">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="aspect-[2/3] w-full object-cover"
                />
              </Card>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-balance text-4xl font-bold md:text-5xl">{movie.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                  <Badge variant="outline">{movie.rating}</Badge>
                </div>
              </div>

              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{movie.description}</p>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Director</p>
                    <p className="text-sm text-muted-foreground">{movie.director}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Star className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Cast</p>
                    <p className="text-sm text-muted-foreground">{movie.cast.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showtimes */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Select Showtime</h2>
          <p className="text-muted-foreground">Choose your preferred time and date</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {movie.showtimes.map((showtime) => (
            <Link key={showtime.id} href={`/booking/${movie.id}?showtime=${showtime.id}`}>
              <Card className="group cursor-pointer p-6 transition-all hover:scale-105 hover:border-primary hover:shadow-lg">
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{showtime.time}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(showtime.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-1 border-t border-border pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold">${showtime.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className={showtime.availableSeats < 20 ? "text-destructive" : "text-green-500"}>
                        {showtime.availableSeats} seats
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Select
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
