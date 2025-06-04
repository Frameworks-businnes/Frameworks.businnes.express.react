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
            
            // Validación mejorada
            if (!model || !year || !brand || price === undefined) {
                res.status(400).json({
                    message: "Model, year, brand, and price are required"
                });
                return;
            }

            let imageUrl = '';
            if (req.file) {
                try {
                    imageUrl = await uploadToCloudinary(req.file);
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    res.status(500).json({
                        message: "Error uploading image"
                    });
                    return;
                }
            }

            const vehicle = await this.repository.create({
                model: model.trim(),
                year: Number(year),
                brand: brand.trim(),
                availability: availability || 'available',
                price: Number(price),
                imageUrl
            });

            res.status(201).json({
                message: "Vehicle created successfully",
                data: vehicle
            });
        } catch (error: any) {
            console.error('Error in create vehicle:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ 
                message: "Valid vehicle ID is required" 
            });
            return;
        }

        try {
            const vehicle = await this.repository.get(Number(id));
            res.status(200).json({ data: vehicle });
        } catch (error: any) {
            if (error.message === "Vehicle not found") {
                res.status(404).json({ message: error.message });
                return;
            }
            console.error('Error getting vehicle by ID:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const vehicles = await this.repository.getAll();
            res.status(200).json({ data: vehicles });
        } catch (error: any) {
            console.error('Error getting all vehicles:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { model, year, brand, availability, price } = req.body;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ 
                message: "Valid vehicle ID is required" 
            });
            return;
        }

        try {
            let imageUrl = '';
            if (req.file) {
                try {
                    imageUrl = await uploadToCloudinary(req.file);
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    res.status(500).json({
                        message: "Error uploading image"
                    });
                    return;
                }
            }

            // Preparar datos de actualización solo con campos presentes
            const updateData: Partial<Vehicle> = {};
            
            if (model !== undefined) updateData.model = model.trim();
            if (year !== undefined) updateData.year = Number(year);
            if (brand !== undefined) updateData.brand = brand.trim();
            if (availability !== undefined) updateData.availability = availability;
            if (price !== undefined) updateData.price = Number(price);
            if (imageUrl) updateData.imageUrl = imageUrl;

            // Validar que al menos un campo esté presente para actualizar
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    message: "At least one field is required to update"
                });
                return;
            }

            const vehicle = await this.repository.update(Number(id), updateData);

            res.status(200).json({
                message: "Vehicle updated successfully",
                data: vehicle
            });
        } catch (error: any) {
            if (error.message === "Vehicle not found") {
                res.status(404).json({ message: error.message });
                return;
            }
            console.error('Error updating vehicle:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ 
                message: "Valid vehicle ID is required" 
            });
            return;
        }

        try {
            const vehicle = await this.repository.delete(Number(id));
            res.status(200).json({
                message: "Vehicle deleted successfully",
                data: vehicle
            });
        } catch (error: any) {
            if (error.message === "Vehicle not found") {
                res.status(404).json({ message: error.message });
                return;
            }
            if (error.message === "Cannot delete vehicle with existing bookings") {
                res.status(409).json({ message: error.message });
                return;
            }
            console.error('Error deleting vehicle:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async getByBrand(req: Request, res: Response): Promise<void> {
        const { brand } = req.params;

        if (!brand || brand.trim() === '') {
            res.status(400).json({ 
                message: "Brand parameter is required" 
            });
            return;
        }

        try {
            const vehicles = await this.repository.getByBrand(brand.trim());
            res.status(200).json({ data: vehicles });
        } catch (error: any) {
            console.error('Error getting vehicles by brand:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async getByModel(req: Request, res: Response): Promise<void> {
        const { model } = req.params;

        if (!model || model.trim() === '') {
            res.status(400).json({ 
                message: "Model parameter is required" 
            });
            return;
        }

        try {
            const vehicles = await this.repository.getByModel(model.trim());
            res.status(200).json({ data: vehicles });
        } catch (error: any) {
            console.error('Error getting vehicles by model:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async getByYear(req: Request, res: Response): Promise<void> {
        const { year } = req.params;

        if (!year || isNaN(Number(year))) {
            res.status(400).json({ 
                message: "Valid year parameter is required" 
            });
            return;
        }

        try {
            const vehicles = await this.repository.getByYear(Number(year));
            res.status(200).json({ data: vehicles });
        } catch (error: any) {
            console.error('Error getting vehicles by year:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }

    async getByAvailability(req: Request, res: Response): Promise<void> {
        const { availability } = req.params;

        if (!availability || availability.trim() === '') {
            res.status(400).json({ 
                message: "Availability parameter is required" 
            });
            return;
        }

        try {
            const vehicles = await this.repository.getByAvailability(availability.trim());
            res.status(200).json({ data: vehicles });
        } catch (error: any) {
            console.error('Error getting vehicles by availability:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || error
            });
        }
    }
}