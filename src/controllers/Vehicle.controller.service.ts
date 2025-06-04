import { Request, Response } from "express";
import { VehicleRepository } from "../repositories/Vehicle.repository";
import { Vehicle } from "../interfaces/Vehicle.interface";
import { uploadToCloudinary } from "../config/cloudinary.config";
import { checkRole, UserRole } from "../middlewares/Role.middleware";

export class VehicleControllerService {
    private repository: VehicleRepository;

    constructor(repository: VehicleRepository) {
        this.repository = repository;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { model, year, brand, availability, price } = req.body;
            let imageUrl = '';

            if (req.file) {
                imageUrl = await uploadToCloudinary(req.file);
            }

            if (!model || !year || !brand || !availability || !price) {
                res.status(400).json({
                    message: "Model, year, brand, availability, and price are required"
                });
                return;
            }

            const vehicle = await this.repository.create({
                model,
                year: Number(year),
                brand,
                availability,
                price: Number(price),
                imageUrl
            });

            res.status(201).json({
                message: "Vehicle created successfully",
                data: vehicle
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const vehicle = await this.repository.get(Number(id));
            res.status(200).json({ data: vehicle });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle not found") {
                res.status(404).json({ message: error.message });
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
            const vehicles = await this.repository.getAll();
            res.status(200).json({ data: vehicles });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { model, year, brand, availability, price } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file);
        }

        if (!model || !year || !brand || !availability || !price) {
            res.status(400).json({
                message: "Model, year, brand, availability, and price are required"
            });
            return;
        }

        try {
            const vehicle = await this.repository.update(Number(id), {
                model,
                year: Number(year),
                brand,
                availability,
                price: Number(price),
                ...(imageUrl && { imageUrl })
            });

            res.status(200).json({
                message: "Vehicle updated successfully",
                data: vehicle
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle not found") {
                res.status(404).json({ message: error.message });
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
            const vehicle = await this.repository.delete(Number(id));
            res.status(200).json({
                message: "Vehicle deleted successfully",
                data: vehicle
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle not found") {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }

    async getByBrand(req: Request, res: Response): Promise<void> {
        const { brand } = req.params;

        try {
            const vehicles = await this.repository.getByBrand(brand);
            res.status(200).json({ data: vehicles });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }

    async getByModel(req: Request, res: Response): Promise<void> {
        const { model } = req.params;

        try {
            const vehicles = await this.repository.getByModel(model);
            res.status(200).json({ data: vehicles });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }

    async getByYear(req: Request, res: Response): Promise<void> {
        const { year } = req.params;

        try {
            const vehicles = await this.repository.getByYear(Number(year));
            res.status(200).json({ data: vehicles });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
}