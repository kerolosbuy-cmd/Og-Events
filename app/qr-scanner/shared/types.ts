export type TabType = 'checkin' | 'checkout' | 'attendees' | 'info';

export interface Seat {
    id: string;
    seat_number: string;
    check_in: boolean | null;
    "last Check-in": string | null;
    booking_id: string | null;
    row_id: string;
    rows?: {
        row_number: string;
        zones?: {
            name: string;
        };
    };
    bookings?: {
        name: string;
        email: string;
        phone: string;
    };
}

export interface ScanResult {
    success: boolean;
    message: string;
    details?: string;
    seatInfo?: string;
    mode?: 'checkin' | 'checkout' | 'info';
}
