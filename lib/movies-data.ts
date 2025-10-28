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
    cast: string[];
    showtimeSummaries: ShowtimeSummary[];
}

export interface ShowtimeSummary {
    id: number;
    startTime: string;
    price: number;
    availableCount: number;
}
/*
export const movies: Movie[] = [
  
  
  
  
  {
    id: "5",
    title: "Midnight in Paris Noir",
    description:
      "A stylish neo-noir mystery set in the streets of Paris. A detective must solve a series of art heists while confronting demons from his past.",
    genre: ["Mystery", "Crime", "Drama"],
    duration: 118,
    rating: "R",
    releaseDate: "2024-02-14",
    poster: "/paris-noir-detective-movie-poster.jpg",
    backdrop: "/paris-night-noir.jpg",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Léa Seydoux", "Vincent Cassel"],
    showtimes: [
      { id: "s14", time: "1:30 PM", date: "2024-03-20", price: 12, availableSeats: 40 },
      { id: "s15", time: "6:00 PM", date: "2024-03-20", price: 15, availableSeats: 22 },
      { id: "s16", time: "9:30 PM", date: "2024-03-20", price: 18, availableSeats: 18 },
    ],
  },
  {
    id: "6",
    title: "The Forgotten Kingdom",
    description:
      "An epic fantasy adventure about a young warrior who must unite the scattered tribes to reclaim her homeland from an ancient evil.",
    genre: ["Fantasy", "Adventure", "Action"],
    duration: 156,
    rating: "PG-13",
    releaseDate: "2024-03-22",
    poster: "/forgotten-kingdom-fantasy-movie-poster.jpg",
    backdrop: "/fantasy-kingdom-epic.jpg",
    director: "Patty Jenkins",
    cast: ["Lupita Nyongo", "Dev Patel", "Gal Gadot"],
    showtimes: [
      { id: "s17", time: "11:30 AM", date: "2024-03-20", price: 15, availableSeats: 50 },
      { id: "s18", time: "3:30 PM", date: "2024-03-20", price: 18, availableSeats: 38 },
      { id: "s19", time: "7:30 PM", date: "2024-03-20", price: 20, availableSeats: 25 },
    ],
  },
]
*/
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMovies(): Promise<Movie[]> {
    const res = await fetch("http://localhost:8080/movies", {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch movies");

    const data = await res.json();
    return data.result;
}

export async function getMovieById(id: number): Promise<Movie> {
    const res = await fetch(`http://localhost:8080/movies/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Movie not found");

    const data = await res.json();
    return data.result;
}
