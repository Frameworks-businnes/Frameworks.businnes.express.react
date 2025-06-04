import { Request, Response } from "express";
import { BookingRepository } from "../repositories/Booking.repository";
import { BookingInterface } from "../interfaces/Booking.interface";
import { BookingRepositoryInterface } from "../interfaces/BookingRepository.interface";
import { VehicleRepository } from "../repositories/Vehicle.repository";
import { CompanyRepository } from "../repositories/Company.repository";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Fix for read-only vfs property
(pdfMake as any).vfs = pdfFonts.vfs;

export class BookingControllerService {
    private repository: BookingRepository;
    private vehicleRepository: VehicleRepository;
    private companyRepository: CompanyRepository;

    constructor(
        repository: BookingRepository,
        vehicleRepository: VehicleRepository,
        companyRepository: CompanyRepository
    ) {
        this.repository = repository;   
        this.vehicleRepository = vehicleRepository;
        this.companyRepository = companyRepository;
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

            // Calculate rental duration in days
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            const timeDifference = endDate.getTime() - startDate.getTime();
            const rentalDurationDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

            let finalPrice = booking.price || 0;

            // Apply 5% extra charge if daily cost is over $50
            if (rentalDurationDays > 0) {
                const dailyPrice = finalPrice / rentalDurationDays;
                if (dailyPrice > 50) {
                    const extraCharge = finalPrice * 0.05;
                    finalPrice += extraCharge;
                    console.log(`Applying 5% extra charge for booking ID ${id}. Original price: ${booking.price}, Daily price: ${dailyPrice.toFixed(2)}, Extra charge: ${extraCharge.toFixed(2)}, Final price: ${finalPrice.toFixed(2)}`);
                }
            }

            const updatedBooking = await this.repository.update(Number(id), {
                ...booking,
                status: 'completed',
                price: finalPrice, // Update the price with the potential extra charge
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

            const company = await this.companyRepository.get();

            const documentDefinition: any = {
                content: [
                    ...(company ? [
                        { text: 'RENTAL AGREEMENT', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
                        { text: `This Rental Agreement (the "Agreement") is made and entered into this ${new Date().toLocaleDateString()} by and between:`, margin: [0, 0, 0, 10] },
                        { text: 'LANDLORD:', style: 'subheader' },
                        { text: company.name, margin: [0, 0, 0, 5] },
                        { text: company.address, margin: [0, 0, 0, 5] },
                        { text: `Branch: ${company.branch}`, margin: [0, 0, 0, 5] },
                        { text: `Phone: ${company.phone}`, margin: [0, 0, 0, 5] },
                        { text: `Email: ${company.email}`, margin: [0, 0, 0, 10] },
                        { text: 'AND', alignment: 'center', margin: [0, 10, 0, 10] },
                        { text: 'TENANT:', style: 'subheader' },
                        { text: `User ID: ${booking.userid}`, margin: [0, 0, 0, 20] },
                    ] : [
                         { text: 'Rental Agreement', style: 'header' },
                         { text: '[Company information not available]', margin: [0, 0, 0, 20] },
                    ]),
                    
                    { text: `Booking ID: ${booking.id}`, margin: [0, 20, 0, 10] },
                    
                    // Add vehicle details
                    { text: 'Vehicle Details:', style: 'subheader' },
                    { text: `Brand: ${vehicle.brand}` },
                    { text: `Model: ${vehicle.model}` },
                    { text: `Year: ${vehicle.year}` },

                    // Add rental details
                    { text: 'Rental Period:', style: 'subheader', margin: [0, 10, 0, 10] },
                    { text: `From: ${new Date(booking.startDate).toDateString()}` },
                    { text: `To: ${new Date(booking.endDate).toDateString()}` },
                    { text: `Total Price: $${booking.price || '0'}`, style: 'total' },

                    // Add signature section
                    { text: '\n\n\n_________________________', alignment: 'right', margin: [0, 50, 0, 0] },
                    { text: 'Client Signature', alignment: 'right' }
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

    async generateAllBookingsReport(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await this.repository.getAll();

            if (bookings.length === 0) {
                res.status(404).json({ message: "No bookings found" });
                return;
            }

            // Get vehicle details for each booking
            const bookingsWithVehicles = await Promise.all(
                bookings.map(async (booking) => {
                    try {
                        const vehicle = await this.vehicleRepository.get(booking.vehicleid);
                        return { booking, vehicle };
                    } catch (error) {
                        console.error(`Error fetching vehicle ${booking.vehicleid}:`, error);
                        return { booking, vehicle: null };
                    }
                })
            );

            // Create summary statistics
            const totalBookings = bookings.length;
            const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
            const pendingBookings = bookings.filter(b => b.status === 'pending').length;
            const completedBookings = bookings.filter(b => b.status === 'completed').length;

            // Create table data for bookings
            const tableBody = [
                ['ID', 'Vehicle', 'Start Date', 'End Date', 'Price', 'Status']
            ];

            bookingsWithVehicles.forEach(({ booking, vehicle }) => {
                tableBody.push([
                    booking.id?.toString() || 'N/A',
                    vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : 'Vehicle not found',
                    new Date(booking.startDate).toLocaleDateString(),
                    new Date(booking.endDate).toLocaleDateString(),
                    `$${booking.price || 0}`,
                    booking.status || 'pending'
                ]);
            });

            const documentDefinition: any = {
                content: [
                    { text: 'All Bookings Report', style: 'header', margin: [0, 0, 0, 20] },
                    
                    // Summary section
                    { text: 'Summary', style: 'subheader', margin: [0, 0, 0, 10] },
                    { text: `Total Bookings: ${totalBookings}` },
                    { text: `Total Revenue: $${totalRevenue.toFixed(2)}` },
                    { text: `Pending Bookings: ${pendingBookings}` },
                    { text: `Completed Bookings: ${completedBookings}` },
                    { text: `Report Generated: ${new Date().toLocaleString()}`, margin: [0, 0, 0, 20] },
                    
                    // Bookings table
                    { text: 'Booking Details', style: 'subheader', margin: [0, 20, 0, 10] },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                            body: tableBody
                        },
                        layout: {
                            fillColor: function (rowIndex: number) {
                                return (rowIndex === 0) ? '#CCCCCC' : null;
                            }
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        bold: true,
                        alignment: 'center'
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                    },
                },
                pageSize: 'A4',
                pageOrientation: 'landscape'
            };

            const pdfDoc = pdfMake.createPdf(documentDefinition);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=all_bookings_report_${Date.now()}.pdf`);

            pdfDoc.getBuffer((buffer: Buffer) => {
                res.send(buffer);
            });

        } catch (error) {
            console.error("Error generating all bookings report:", error);
            res.status(500).json({
                message: "Error generating all bookings report",
                error: error,
            });
        }
    }
}