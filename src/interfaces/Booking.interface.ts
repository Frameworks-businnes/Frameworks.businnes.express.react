export interface BookingInterface {
    id?: number;
    userid: number;
    vehicleid: number;
    startDate: Date;
    endDate: Date;
    price: number;
}

export interface BookingResponseInterface {
    id?: number;
    userid: number;
    vehicleid: number;
    startDate: Date;
    endDate: Date;
    price: number;
}
