import Link from "next/link"
import { getMovies } from "@/lib/movies-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MovieList from "@/components/movie-list"

export default async function HomePage() {
  const movies = await getMovies();

  const now = new Date();

  // Filter movies released before today
  const nowShowingMovies = movies.filter(
    (movie) => new Date(movie.releaseDate) < now
  );

  // Randomly pick one
  const randomMovie =
    nowShowingMovies[0];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${randomMovie.backdropUrl}")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-16">
          <div className="max-w-2xl space-y-4">
            <Badge className="w-fit bg-primary/20 text-primary">Now Showing</Badge>
            <h1 className="text-balance text-5xl font-bold leading-tight md:text-6xl">{randomMovie.title}</h1>
            <p className="text-pretty text-lg text-muted-foreground">{randomMovie.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/movie/${randomMovie.id}`}>
                <Button size="lg" className="gap-2">
                  Book Tickets
                </Button>
              </Link>
              <Link href={`/movie/${randomMovie.id}`}>
                <Button size="lg" variant="outline">
                More details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <MovieList movies={movies} />
    </main>
  )
}


