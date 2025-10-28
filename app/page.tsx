import Link from "next/link"
import { getMovies } from "@/lib/movies-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default async function HomePage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${movies[0].backdropUrl}")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-16">
          <div className="max-w-2xl space-y-4">
            <Badge className="w-fit bg-primary/20 text-primary">Now Showing</Badge>
            <h1 className="text-balance text-5xl font-bold leading-tight md:text-6xl">{movies[0].title}</h1>
            <p className="text-pretty text-lg text-muted-foreground">{movies[0].description}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/movie/${movies[0].id}`}>
                <Button size="lg" className="gap-2">
                  Book Tickets
                </Button>
              </Link>
              <Link href={`/movie/${movies[0].id}`}>
                <Button size="lg" variant="outline">
                More details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Now Playing</h2>
          <p className="text-muted-foreground">Book your tickets for the latest releases</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
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
                  <h3 className="text-balance font-semibold leading-tight">{movie.title}</h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration} min</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {movie.rating}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {movie.genre
                      .split(",")
                      .slice(0, 2)
                      .map((g) => (
                        <Badge key={g.trim()} variant="secondary" className="text-xs">
                          {g.trim()}
                        </Badge>
                      ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}


