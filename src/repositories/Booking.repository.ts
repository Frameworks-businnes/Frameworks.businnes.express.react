import { PrismaClient } from '../generated/prisma';
import { BookingInterface, BookingResponseInterface } from '../interfaces/Booking.interface';
import { BookingRepositoryInterface } from '../interfaces/BookingRepository.interface';

const prisma = new PrismaClient();

export class BookingRepository implements BookingRepositoryInterface {
    getByVehicleIdAndStatus(arg0: number, status: string) {
        return prisma.booking.findMany({
            where: {
                vehiculoid: arg0,
                status: status
            }
        });
    }
    getByUserIdAndStatus(arg0: number, status: string) {
        return prisma.booking.findMany({
            where: {
                userid: arg0,
                status: status
            }
        });
    }
    getByDatePriceAndStatus(arg0: Date, arg1: Date, arg2: number, arg3: number, arg4: string) {
        return prisma.booking.findMany({
            where: {
                date_start: {
                    gte: arg0,
                },
                date_end: {
                    lte: arg1,
                },
                price: {
                    gte: arg2,
                    lte: arg3
                },
                status: arg4
            }
        });
    }

    getByPriceAndStatus(arg0: number, arg1: number, arg2: string) {
        return prisma.booking.findMany({
            where: {
                price: {
                    gte: arg0,
                    lte: arg1
                },
                status: arg2
            }
        });
    }
    getByDateAndStatus(arg0: Date, arg1: Date, arg2: string) {
        return prisma.booking.findMany({
            where: {
                date_start: {
                    gte: arg0,
                },
                date_end: {
                    lte: arg1,
                },
                status: arg2
            }
        });
    }
    getByPriceRange(arg0: number, arg1: number) {
        return prisma.booking.findMany({
            where: {
                price: {
                    gte: arg0,
                    lte: arg1
                }
            }
        });
    }
    getByStatus(status: string) {
        return prisma.booking.findMany({
            where: {
                status: status
            }
        });
    }
    async create(booking: Partial<BookingInterface>): Promise<BookingInterface> {
        try {
            const newBooking = await prisma.booking.create({
                data: {
                    userid: booking.userid!,
                    vehiculoid: booking.vehiculoid!,
                    date_start: booking.date_start!,
                    date_end: booking.date_end!,
                    status: booking.status!,
                    price: booking.price!
                }
            });

            return newBooking;
        } catch (error) {
            throw error;
        }
    }
    async get(id: number): Promise<BookingInterface> {
        try {
            const booking = await prisma.booking.findUnique({ where: { id } });
            if (!booking) {
                throw new Error(`Booking with id ${id} not found`);
            }
            return booking;
        } catch (error) {
            throw error;
        }
    }
    async getAll(): Promise<BookingInterface[]> {   
        try {
            return await prisma.booking.findMany();
        } catch (error) {
            throw error;
        }
    }
    async update(id: number, booking: Partial<BookingInterface>): Promise<BookingInterface> {
        try {
            return await prisma.booking.update({
                where: { id },
                data: booking,
            });
        } catch (error) {
            throw error;
        }
    }
    async delete(id: number): Promise<BookingInterface> {
        try {
            const deletedBooking = await prisma.booking.delete({ where: { id } });
            return deletedBooking;
        } catch (error) {
            throw error;
        }
    }
    async getByUserId(userId: number): Promise<BookingInterface[]> {
        try {
            return await prisma.booking.findMany({ where: { cliente: userId } });
        } catch (error) {
            throw error;
        }
    }
    async getByVehicleId(vehicleId: number): Promise<BookingInterface[]> {
        try {
            return await prisma.booking.findMany({ where: { vehiculo: vehicleId } });
        } catch (error) {
            throw error;
        }
    }
    async getByDateRange(startDate: Date, endDate: Date): Promise<BookingInterface[]> {
        try {
            return await prisma.booking.findMany({
                where: {
                    date_start: {
                        gte: startDate,
                    },
                    date_end: {
                        lte: endDate,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }
    toResponseObject(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectList(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObject(booking));
    }
    toResponseObjectWithVehicle(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithVehicle(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithVehicle(booking));
    }
    toResponseObjectWithUser(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithUser(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithUser(booking));
    }
    toResponseObjectWithDateRange(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithDateRange(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithDateRange(booking));
    }
    toResponseObjectWithStatus(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.vehiculoid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithStatus(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithStatus(booking));
    }
    toResponseObjectWithPrice(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithPrice(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithPrice(booking));
    }
    toResponseObjectWithId(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithId(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithId(booking));
    }
    toResponseObjectWithCliente(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithCliente(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithCliente(booking));
    }
    toResponseObjectWithVehiculo(booking: BookingInterface): BookingResponseInterface {
        return {
            id: booking.id,
            userid: booking.userid,
            vehiculoid: booking.vehiculoid,
            date_start: booking.date_start,
            date_end: booking.date_end,
            status: booking.status,
            price: booking.price
        };
    }
    toResponseObjectListWithVehiculo(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObjectWithVehiculo(booking));
    }
}