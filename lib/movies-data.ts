export interface Movie {
  id: string
  title: string
  description: string
  genre: string
  duration: number
  rating: string
  releaseDate: string
  posterUrl: string
  backdropUrl: string
  director: string
  cast: string[]
  showtimes: Showtime[]
}

export interface Showtime {
  id: string
  time: string
  date: string
  price: number
  availableSeats: number
}
/*
export const movies: Movie[] = [
  {
    id: "1",
    title: "Quantum Nexus",
    description:
      "A mind-bending sci-fi thriller that explores the boundaries of reality and consciousness. When a physicist discovers a way to access parallel universes, she must race against time to prevent a catastrophic collision of worlds.",
    genre: ["Sci-Fi", "Thriller", "Action"],
    duration: 142,
    rating: "PG-13",
    releaseDate: "2024-03-15",
    poster: "/quantum-nexus-movie-poster.jpg",
    backdrop: "/quantum-nexus-movie-backdrop.jpg",
    director: "Sarah Chen",
    cast: ["Emma Stone", "Oscar Isaac", "Tilda Swinton"],
    showtimes: [
      { id: "s1", time: "10:00 AM", date: "2024-03-20", price: 12, availableSeats: 45 },
      { id: "s2", time: "2:30 PM", date: "2024-03-20", price: 15, availableSeats: 32 },
      { id: "s3", time: "7:00 PM", date: "2024-03-20", price: 18, availableSeats: 28 },
      { id: "s4", time: "10:30 PM", date: "2024-03-20", price: 15, availableSeats: 50 },
    ],
  },
  {
    id: "2",
    title: "The Last Symphony",
    description:
      "An emotional journey through music and memory. A renowned conductor must confront her past when she returns to her hometown to lead one final performance.",
    genre: ["Drama", "Music"],
    duration: 128,
    rating: "PG",
    releaseDate: "2024-02-28",
    poster: "/the-last-symphony-movie-poster.jpg",
    backdrop: "/orchestra-concert-hall.jpg",
    director: "Michael Anderson",
    cast: ["Cate Blanchett", "Mahershala Ali", "Saoirse Ronan"],
    showtimes: [
      { id: "s5", time: "11:00 AM", date: "2024-03-20", price: 12, availableSeats: 38 },
      { id: "s6", time: "3:00 PM", date: "2024-03-20", price: 15, availableSeats: 25 },
      { id: "s7", time: "8:00 PM", date: "2024-03-20", price: 18, availableSeats: 15 },
    ],
  },
  {
    id: "3",
    title: "Shadow Protocol",
    description:
      "A high-stakes espionage thriller where nothing is as it seems. An elite spy must uncover a mole within her organization before a global crisis unfolds.",
    genre: ["Action", "Thriller", "Spy"],
    duration: 135,
    rating: "R",
    releaseDate: "2024-03-08",
    poster: "/shadow-protocol-spy-movie-poster.jpg",
    backdrop: "/spy-action-scene.jpg",
    director: "David Leitch",
    cast: ["Charlize Theron", "Idris Elba", "Rebecca Ferguson"],
    showtimes: [
      { id: "s8", time: "12:00 PM", date: "2024-03-20", price: 12, availableSeats: 42 },
      { id: "s9", time: "4:30 PM", date: "2024-03-20", price: 15, availableSeats: 30 },
      { id: "s10", time: "9:00 PM", date: "2024-03-20", price: 18, availableSeats: 20 },
    ],
  },
  {
    id: "4",
    title: "Cosmic Dreams",
    description:
      "An animated adventure that takes audiences on a journey through the cosmos. A young astronaut discovers a hidden galaxy where dreams become reality.",
    genre: ["Animation", "Adventure", "Family"],
    duration: 98,
    rating: "G",
    releaseDate: "2024-03-01",
    poster: "/cosmic-dreams-animated-movie-poster.jpg",
    backdrop: "/space-galaxy-colorful.jpg",
    director: "Jennifer Lee",
    cast: ["Voice Cast: Tom Hanks", "Zendaya", "John Boyega"],
    showtimes: [
      { id: "s11", time: "10:30 AM", date: "2024-03-20", price: 10, availableSeats: 55 },
      { id: "s12", time: "1:00 PM", date: "2024-03-20", price: 12, availableSeats: 48 },
      { id: "s13", time: "5:00 PM", date: "2024-03-20", price: 15, availableSeats: 35 },
    ],
  },
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

export async function getMovies(): Promise<Movie[]> {
  const res = await fetch("http://localhost:8080/movies", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch movies");

  const data = await res.json();
  return data.result;
}

/*
export function getMovieById(id: string): Movie | undefined {
  return movies.find((movie) => movie.id === id)
}
*/

export async function getMovieById(id: string): Promise<Movie> {
  const res = await fetch(`http://localhost:8080/movies/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Movie not found");

  const data = await res.json();
  return data.result; 
}

