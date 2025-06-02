import { PrismaClient } from '../generated/prisma';
import { BookingInterface, BookingResponseInterface } from '../interfaces/Booking.interface';
import { BookingRepositoryInterface } from '../interfaces/BookingRepository.interface';

const prisma = new PrismaClient();

export class BookingRepository implements BookingRepositoryInterface {
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

    async create(booking: Partial<BookingInterface>): Promise<BookingInterface> {
        try {
            const newBooking = await prisma.booking.create({
                data: {
                    userid: booking.userid!,
                    vehicleid: booking.vehicleid!,
                    startDate: booking.startDate!,
                    endDate: booking.endDate!,
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
            return await prisma.booking.findMany({ where: { userid: userId } });
        } catch (error) {
            throw error;
        }
    }
    async getByVehicleId(vehicleId: number): Promise<BookingInterface[]> {
        try {
            return await prisma.booking.findMany({ where: { vehicleid: vehicleId } });
        } catch (error) {
            throw error;
        }
    }
    async getByDateRange(startDate: Date, endDate: Date): Promise<BookingInterface[]> {
        try {
            return await prisma.booking.findMany({
                where: {
                    startDate: {
                        gte: startDate,
                    },
                    endDate: {
                        lte: endDate,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }
    toResponseObject(booking: BookingInterface): BookingResponseInterface {
            const { id, userid, vehicleid, startDate, endDate, price } = booking;
            return { id: id!, userid, vehicleid, startDate, endDate, price };
    }
    toResponseObjectList(bookings: BookingInterface[]): BookingResponseInterface[] {
        return bookings.map((booking) => this.toResponseObject(booking));
    }
}