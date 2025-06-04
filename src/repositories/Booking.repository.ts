import { PrismaClient } from '../generated/prisma';
import { BookingInterface, BookingResponseInterface } from '../interfaces/Booking.interface';
import { BookingRepositoryInterface } from '../interfaces/BookingRepository.interface';

const prisma = new PrismaClient();

export class BookingRepository implements BookingRepositoryInterface {
    async create(booking: Partial<BookingInterface>): Promise<BookingInterface> {
        try {
            const newBooking = await prisma.booking.create({
                data: {
                    userId: booking.userid!,
                    vehicleId: booking.vehicleid!,
                    startDate: booking.startDate!,
                    endDate: booking.endDate!,
                    totalPrice: booking.price!,
                    status: "pending",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            return this.toBookingInterface(newBooking);
        } catch (error) {
            throw error;
        }
    }

    async get(id: number): Promise<BookingInterface> {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            return this.toBookingInterface(booking);
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<BookingInterface[]> {
        try {
            const bookings = await prisma.booking.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    vehicle: true
                }
            });
            return bookings.map(booking => this.toBookingInterface(booking));
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, booking: Partial<BookingInterface>): Promise<BookingInterface> {
        try {
            const updatedBooking = await prisma.booking.update({
                where: { id },
                data: {
                    userId: booking.userid,
                    vehicleId: booking.vehicleid,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    totalPrice: booking.price,
                    updatedAt: new Date()
                }
            });
            return this.toBookingInterface(updatedBooking);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<BookingInterface> {
        try {
            const deletedBooking = await prisma.booking.delete({
                where: { id }
            });
            return this.toBookingInterface(deletedBooking);
        } catch (error) {
            throw error;
        }
    }

    async getByUserId(userid: number): Promise<BookingInterface[]> {
        try {
            const bookings = await prisma.booking.findMany({
                where: { userId: userid },
                include: {
                    vehicle: true
                }
            });
            return bookings.map(booking => this.toBookingInterface(booking));
        } catch (error) {
            throw error;
        }
    }

    async getByVehicleId(vehicleid: number): Promise<BookingInterface[]> {
        try {
            const bookings = await prisma.booking.findMany({
                where: { vehicleId: vehicleid }
            });
            return bookings.map(booking => this.toBookingInterface(booking));
        } catch (error) {
            throw error;
        }
    }

    async getByDateRange(startDate: Date, endDate: Date): Promise<BookingInterface[]> {
        try {
            const bookings = await prisma.booking.findMany({
                where: {
                    startDate: {
                        gte: startDate
                    },
                    endDate: {
                        lte: endDate
                    }
                }
            });
            return bookings.map(booking => this.toBookingInterface(booking));
        } catch (error) {
            throw error;
        }
    }

    async getByPriceRange(minPrice: number, maxPrice: number): Promise<BookingInterface[]> {
        try {
            const bookings = await prisma.booking.findMany({
                where: {
                    totalPrice: {
                        gte: minPrice,
                        lte: maxPrice
                    }
                }
            });
            return bookings.map(booking => this.toBookingInterface(booking));
        } catch (error) {
            throw error;
        }
    }

    toResponseObject(booking: BookingInterface): BookingResponseInterface {
        const { id, userid, vehicleid, startDate, endDate, price, status, createdAt, updatedAt } = booking;
        return { id: id!, userid, vehicleid, startDate, endDate, price, status, createdAt: createdAt!, updatedAt: updatedAt! };
    }

    private toBookingInterface(prismaBooking: any): BookingInterface {
        return {
            id: prismaBooking.id,
            userid: prismaBooking.userId,
            vehicleid: prismaBooking.vehicleId,
            startDate: prismaBooking.startDate,
            endDate: prismaBooking.endDate,
            price: prismaBooking.totalPrice || 0,
            status: prismaBooking.status,
            availability: prismaBooking.vehicle?.availability,
            createdAt: prismaBooking.createdAt,
            updatedAt: prismaBooking.updatedAt
        };
    }
}