import { UserResponseInterface } from '../interfaces/User.interface';
import { Vehicle } from './Vehicle.interface';

export interface BookingInterface {
    id?: number;
    userid: number;
    vehicleid: number;
    startDate: Date;
    endDate: Date;
    price: number;
    totalCost?: number;
    status: string;
    availability?: string;
    createdAt?: Date;
    updatedAt?: Date;
    user?: UserResponseInterface;
    vehicle?: Vehicle;
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
