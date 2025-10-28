
import { notFound } from "next/navigation";
import { getMovieById } from "@/lib/movies-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Star, User } from "lucide-react";
import ShowtimeList from "@/components/showtime-list"

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const movie = await getMovieById(Number(id))

    if (!movie) {
        notFound();
    }

    return (
        <main className="min-h-screen">
            {/* Movie Header */}
            <section className="relative h-[600px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${movie.backdropUrl}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
                </div>

                <div className="container relative mx-auto flex h-full items-end px-4 pb-12">
                    <div className="flex flex-col gap-8 md:flex-row">
                        <div className="w-full md:w-64 lg:w-80">
                            <Card className="overflow-hidden">
                                <img
                                    src={movie.posterUrl || "/placeholder.svg"}
                                    alt={movie.title}
                                    className="aspect-[2/3] w-full object-cover"
                                />
                            </Card>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {movie.genre
                                        .split(",")
                                        .slice(0, 2)
                                        .map((g) => (
                                            <Badge
                                                key={g.trim()}
                                                variant="secondary"
                                            >
                                                {g.trim()}
                                            </Badge>
                                        ))}
                                </div>

                                <h1 className="text-balance text-4xl font-bold md:text-5xl">
                                    {movie.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{movie.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(
                                                movie.releaseDate
                                            ).getFullYear()}
                                        </span>
                                    </div>
                                    <Badge variant="outline">
                                        {movie.rating}
                                    </Badge>
                                </div>
                            </div>

                            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                                {movie.description}
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <User className="mt-1 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Director
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {movie.director}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Star className="mt-1 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Cast
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {movie.cast}
                                        </p>
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
                    <p className="text-muted-foreground">
                        Choose your preferred time and date
                    </p>
                </div>

                {movie.showtimeSummaries && movie.showtimeSummaries.length > 0 ? (
                    <ShowtimeList showtimes={movie.showtimeSummaries} />
                ) : (
                    <p className="text-muted-foreground">
                    No showtimes available for this movie.
                    </p>
                )}
            </section>
        </main>
    );
}
