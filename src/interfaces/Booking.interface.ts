export interface BookingInterface {
    id?: number;
    userid: number;
    vehiculoid: number;
    date_start: Date;
    date_end: Date;
    status: string;
    price: number;
}

export interface BookingResponseInterface {
    id?: number;
    userid: number;
    vehiculoid: number;
    date_start: Date;
    date_end: Date;
    status: string;
    price: number;
}
