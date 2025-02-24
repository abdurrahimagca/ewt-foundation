// Flight Information Entity Type
export interface CeFlightInfo {
    id: string;
    arrival_date: string; // Date format: YYYY-MM-DD
    return_date: string; // Date format: YYYY-MM-DD
    arrival_airport: string;
    departure_airport: string;
    airline: string;
    flight_number: string;
    arrival_time: string; // Time format: HH:MM:SS
    departure_time: string; // Time format: HH:MM:SS
    order_id: string;
}

// Traveler Information Entity Type
export interface CeTraveler {
    id: string;
    fullname: string;
    birthdate: string; // Date format: YYYY-MM-DD
    email: string;
    phone: string;
    passport_number: string;
    flight_info_id: string;
}
