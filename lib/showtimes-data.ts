export interface Ticket {
    id: number;
    price: number;
    available: boolean;
    rowLabel: string;
    seatNumber: number;
}

export interface Showtime {
    id: number;
    startTime: string;
    movieId: string;
    movieTitle: string;
    auditoriumId: number;
    auditoriumName: string;
    totalRows: number;
    seatsPerRow: number;
    tickets: Ticket[];
}

export async function getShowtimeById(id: number): Promise<Showtime> {
    const res = await fetch(`http://localhost:8080/showtimes/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Showtime not found");

    const data = await res.json();
    return data.result;
}

export interface Seat {
    id: number;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
}




