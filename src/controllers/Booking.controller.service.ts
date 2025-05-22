import { Request, Response } from "express";
import { BookingRepository } from "../repositories/Booking.repository";
import { BookingInterface } from "../interfaces/Booking.interface";
import { BookingRepositoryInterface } from "../interfaces/BookingRepository.interface";

export class BookingControllerService {
    private repository: BookingRepository;
    constructor(repository: BookingRepository) {
        this.repository = repository;   
    }

    async create(req: Request, res: Response): Promise<void> {
        const { userid, vehiculoid, date_start, date_end, status, price } = req.body;

        if (!userid || !vehiculoid || !date_start || !date_end || !status || !price) {
            res.status(400).json({
                message: "Cliente, vehiculo, date_start, date_end, status and price are required"
            });
            return;
        }

        try {
            const booking = await this.repository.create({ userid, vehiculoid, date_start, date_end, status, price });

            res.status(201).json({
                message: "Booking created successfully",
                data: this.repository.toResponseObject(booking)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Booking already exists") {
                res.status(409).json({
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
        const { userid, vehiculoid, date_start, date_end, status, price } = req.body;

        if (!userid || !vehiculoid || !date_start || !date_end || !status || !price) {
            res.status(400).json({
                message: "Cliente, vehiculo, date_start, date_end, status and price are required"
            });
            return;
        }

        try {
            const booking = await this.repository.update(Number(id), { userid, vehiculoid, date_start, date_end, status, price });

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
        const { userId } = req.params;

        try {
            const bookings = await this.repository.getByUserId(Number(userId));

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
        const { vehicleId } = req.params;

        try {
            const bookings = await this.repository.getByVehicleId(Number(vehicleId));

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
    async getByStatus(req: Request, res: Response): Promise<void> {
        const { status } = req.params;

        try {
            const bookings = await this.repository.getByStatus(status);

            res.status(200).json({
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
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
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByDateAndStatus(req: Request, res: Response): Promise<void> {
        const { startDate, endDate, status } = req.query;

        if (!startDate || !endDate || !status) {
            res.status(400).json({
                message: "startDate, endDate and status are required"
            });
            return;
        }

        try {
            const bookings = await this.repository.getByDateAndStatus(new Date(startDate as string), new Date(endDate as string), status as string);

            res.status(200).json({
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByPriceAndStatus(req: Request, res: Response): Promise<void> {
        const { minPrice, maxPrice, status } = req.query;

        if (!minPrice || !maxPrice || !status) {
            res.status(400).json({
                message: "minPrice, maxPrice and status are required"
            });
            return;
        }

        try {
            const bookings = await this.repository.getByPriceAndStatus(Number(minPrice), Number(maxPrice), status as string);

            res.status(200).json({
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByDatePriceAndStatus(req: Request, res: Response): Promise<void> {
        const { startDate, endDate, minPrice, maxPrice, status } = req.query;

        if (!startDate || !endDate || !minPrice || !maxPrice || !status) {
            res.status(400).json({
                message: "startDate, endDate, minPrice, maxPrice and status are required"
            });
            return;
        }

        try {
            const bookings = await this.repository.getByDatePriceAndStatus(new Date(startDate as string), new Date(endDate as string), Number(minPrice), Number(maxPrice), status as string);

            res.status(200).json({
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByUserIdAndStatus(req: Request, res: Response): Promise<void> {    
        const { userId, status } = req.params;

        try {
            const bookings = await this.repository.getByUserIdAndStatus(Number(userId), status);

            res.status(200).json({
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
    async getByVehicleIdAndStatus(req: Request, res: Response): Promise<void> {
        const { vehicleId, status } = req.params;

        try {
            const bookings = await this.repository.getByVehicleIdAndStatus(Number(vehicleId), status);

            res.status(200).json({
                data: bookings.map((booking: BookingInterface) => this.repository.toResponseObject(booking))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
}