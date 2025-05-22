import { BookingInterface} from "./Booking.interface";

export interface BookingRepositoryInterface {

    create(booking: Partial<BookingInterface>): Promise<BookingInterface>;
    get(id: number): Promise<BookingInterface>;
    getAll(): Promise<BookingInterface[]>;
    update(id: number, booking: Partial<BookingInterface>): Promise<BookingInterface>;
    delete(id: number): Promise<BookingInterface>;
    getByUserId(userId: number): Promise<BookingInterface[]>;
    getByVehicleId(vehicleId: number): Promise<BookingInterface[]>;
    getByDateRange(startDate: Date, endDate: Date): Promise<BookingInterface[]>;
}
