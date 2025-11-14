export interface Movie {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration: number;
    rating: string;
    releaseDate: string;
    posterUrl: string;
    backdropUrl: string;
    director: string;
    actors: string[];
    status: string;
    showtimeSummaries: ShowtimeSummary[];
}

export interface ShowtimeSummary {
    id: number;
    startTime: string;
    price: number;
    availableCount: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMovies(): Promise<Movie[]> {
    const res = await fetch(`${API_BASE}/movies`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch movies");

    const data = await res.json();
    return data.result;
}

export async function getMovieById(id: number): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Movie not found");

    const data = await res.json();
    return data.result;
}
