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

export interface Seat {
    id: number;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
}




