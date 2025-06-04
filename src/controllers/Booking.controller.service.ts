import { Request, Response } from "express";
import { BookingRepository } from "../repositories/Booking.repository";
import { BookingInterface } from "../interfaces/Booking.interface";
import { BookingRepositoryInterface } from "../interfaces/BookingRepository.interface";
import { VehicleRepository } from "../repositories/Vehicle.repository";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Fix for read-only vfs property
(pdfMake as any).vfs = pdfFonts.vfs;

export class BookingControllerService {
    private repository: BookingRepository;
    private vehicleRepository: VehicleRepository;

    constructor(
        repository: BookingRepository,
        vehicleRepository: VehicleRepository
    ) {
        this.repository = repository;   
        this.vehicleRepository = vehicleRepository;
    }
    async create(req: Request, res: Response): Promise<void> {
        const { userid, vehicleid, startDate, endDate, price } = req.body;

        if (!userid || !vehicleid || !startDate || !endDate || !price) {
            res.status(400).json({
                message: "Cliente, vehiculo, date_start, date_end, status and price are required"
            });
            return;
        }

        try {
            // Check vehicle availability before creating booking
            const vehicle = await this.vehicleRepository.get(vehicleid);

            if (!vehicle) {
                 res.status(404).json({
                     message: "Vehicle not found."
                 });
                 return;
            }

            // Add log before checking availability
            console.log(`Attempting to create booking for vehicle ID ${vehicleid}. Initial availability: ${vehicle.availability}`);

            // Allow booking if vehicle is 'available' or 'maintenance'
            if (vehicle.availability !== 'available' && vehicle.availability !== 'maintenance') {
                 res.status(400).json({
                     message: `Vehicle is currently ${vehicle.availability} and cannot be booked.`
                 });
                 return;
            }

            // Create the booking with pending status
            const booking = await this.repository.create({ userid, vehicleid, startDate, endDate, price, status: 'pending' });

            // Update vehicle availability ONLY if it was 'available' initially
            if (vehicle.availability === 'available') {
              try { // Add try-catch around the update
                console.log(`Vehicle ID ${vehicleid} was available, attempting to update to 'unavailable'.`);
                await this.vehicleRepository.update(vehicleid, { ...vehicle, availability: 'unavailable' });
                const updatedVehicleInDB = await this.vehicleRepository.get(vehicleid);
                console.log(`Vehicle ID ${vehicleid} availability after update attempt: ${updatedVehicleInDB?.availability}`);
              } catch (updateError) {
                  console.error(`Error updating vehicle ID ${vehicleid} availability after booking:`, updateError);
              }
            }

            res.status(201).json({
                message: "Booking created successfully",
                data: this.repository.toResponseObject(booking)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Booking already exists") {
                console.error("Booking already exists error:", error); // Log specific error
                res.status(409).json({
                    message: error.message
                });
                return;
            }

            console.error("Server error during booking creation:", error); // Log general server error
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const booking = await this.repository.get(Number(id));

            res.status(200).json({
                data: this.repository.toResponseObject(booking)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                res.status(404).json({
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await this.repository.getAll();

            res.status(200).json({
                data: bookings.map(booking => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async update(req: Request, res: Response): Promise<void> {          
        const { id } = req.params;
        const { userid, vehicleid, startDate, endDate, price } = req.body;

        if (!userid || !vehicleid || !startDate || !endDate || !price) {
            res.status(400).json({
                message: "Cliente, vehiculo, date_start, date_end, status and price are required"
            });
            return;
        }

        try {
            const booking = await this.repository.update(Number(id), { userid, vehicleid, startDate, endDate, price });

            res.status(200).json({
                message: "Booking updated successfully",
                data: this.repository.toResponseObject(booking)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                res.status(404).json({
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const booking = await this.repository.delete(Number(id));

            res.status(200).json({
                message: "Booking deleted successfully",
                data: this.repository.toResponseObject(booking)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                res.status(404).json({
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByUserId(req: Request, res: Response): Promise<void> {
        const { userid } = req.params;

        try {
            const bookings = await this.repository.getByUserId(Number(userid));

            res.status(200).json({
                data: bookings.map(booking => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByVehicleId(req: Request, res: Response): Promise<void> {
        const { vehicleid } = req.params;

        try {
            const bookings = await this.repository.getByVehicleId(Number(vehicleid));

            res.status(200).json({
                data: bookings.map(booking => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByDateRange(req: Request, res: Response): Promise<void> {      
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json({
                message: "startDate and endDate are required"
            });
            return;
        }

        try {
            const bookings = await this.repository.getByDateRange(new Date(startDate as string), new Date(endDate as string));

            res.status(200).json({
                data: bookings.map(booking => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByPriceRange(req: Request, res: Response): Promise<void> {
        const { minPrice, maxPrice } = req.query;

        if (!minPrice || !maxPrice) {
            res.status(400).json({
                message: "minPrice and maxPrice are required"
            });
            return;
        }

        try {
            const bookings = await this.repository.getByPriceRange(Number(minPrice), Number(maxPrice));

            res.status(200).json({
                data: bookings.map(booking => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async convertToRental(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { paymentMethod, notes } = req.body;

        try {
            const booking = await this.repository.get(Number(id));

            if (!booking) {
                res.status(404).json({ message: "Booking not found" });
                return;
            }

            const vehicleId = booking.vehicleid;
            const vehicle = await this.vehicleRepository.get(vehicleId);

            if (!vehicle) {
                console.error(`Vehicle not found for booking ID ${id}`);
                res.status(404).json({ message: "Associated vehicle not found." });
                return;
            }

            // Prevent conversion to rental if the vehicle is under maintenance
            if (vehicle.availability === 'maintenance') {
                 res.status(400).json({ message: "Cannot convert booking to rental: Vehicle is under maintenance." });
                 return;
            }

            const updatedBooking = await this.repository.update(Number(id), {
                ...booking,
                status: 'completed',
            });

            // Add this line to update vehicle availability to 'completed'
            await this.vehicleRepository.update(vehicleId, { ...vehicle, availability: 'completed' });

            res.status(200).json({
                message: "Booking converted to rental successfully",
                data: this.repository.toResponseObject(updatedBooking)
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    }
    async cancelBooking(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const booking = await this.repository.get(Number(id));

            if (!booking) {
                res.status(404).json({ message: "Booking not found" });
                return;
            }

            if (booking.status !== 'pending') {
                res.status(400).json({ message: `Booking status is ${booking.status}. Only pending bookings can be cancelled.` });
                return;
            }

            await this.repository.delete(Number(id));

            // After successful cancellation, update vehicle availability back to 'available'
            const vehicleId = booking.vehicleid;
            const vehicle = await this.vehicleRepository.get(vehicleId);

            if (vehicle) {
              await this.vehicleRepository.update(vehicleId, { ...vehicle, availability: 'available' });
            } else {
              console.error(`Vehicle with ID ${vehicleId} not found for cancelled booking ${id}.`);
            }

            res.status(200).json({
                message: "Booking cancelled successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    }
    async generateRentalPdf(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const bookingId = Number(id);
            const booking = await this.repository.get(bookingId);

            if (!booking) {
                res.status(404).json({ message: "Booking not found" });
                return;
            }

            const vehicle = await this.vehicleRepository.get(booking.vehicleid);

            if (!vehicle) {
                 res.status(404).json({ message: "Associated vehicle not found." });
                 return;
            }
            
            // Properly typed document definition for pdfmake
            const documentDefinition: any = {
                content: [
                    { text: 'Rental Agreement', style: 'header' },
                    { text: `Booking ID: ${booking.id}`, margin: [0, 20, 0, 10] },
                    // Add vehicle details
                    { text: 'Vehicle Details:', style: 'subheader' },
                    { text: `Brand: ${vehicle.brand}` },
                    { text: `Model: ${vehicle.model}` },
                    { text: `Year: ${vehicle.year}` },
                    // Add user details
                    { text: 'Customer Details:', style: 'subheader', margin: [0, 10, 0, 10] },
                    { text: `User ID: ${booking.userid}` },
                    // Add rental details
                    { text: 'Rental Period:', style: 'subheader', margin: [0, 10, 0, 10] },
                    { text: `From: ${booking.startDate.toDateString()}` },
                    { text: `To: ${new Date(booking.endDate).toDateString()}` },
                    { text: `Total Price: $${booking.price || '0'}`, style: 'total' },
                    // If payment method and notes are stored with the booking/rental, fetch and include them here.
                    // Otherwise, they are not available in this GET request.
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                    },
                    total: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 0],
                    },
                },
            };

            const pdfDoc = pdfMake.createPdf(documentDefinition);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=rental_${bookingId}.pdf`);

            // Use getBuffer or getStream instead of pipe/end
            pdfDoc.getBuffer((buffer: Buffer) => {
                res.send(buffer);
            });

        } catch (error) {
            console.error("Error generating rental PDF:", error);
            res.status(500).json({
                message: "Error generating rental PDF",
                error: error,
            });
        }
    }
}