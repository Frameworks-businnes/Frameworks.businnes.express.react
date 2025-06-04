export interface BookingInterface {
    id?: number;
    userid: number;
    vehicleid: number;
    startDate: Date;
    endDate: Date;
    price: number;
    status: string;
    availability?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BookingResponseInterface {
    id?: number;
    userid: number;
    vehicleid: number;
    startDate: Date;
    endDate: Date;
    price: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}
