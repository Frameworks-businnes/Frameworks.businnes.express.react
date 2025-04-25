import { Request, Response } from "express";
import { VehicleRepository } from "../repositories/Vehicle.repository";
import { VehicleInterface } from "../interfaces/Vehicle.interface";
import { VehicleRepositoryInterface } from "../interfaces/VehicleRepository.interface";


export class VehicleControllerService {
    private repository: VehicleRepository;
    constructor(repository: VehicleRepository) {
        this.repository = repository;   
    }

    async create(req: Request, res: Response): Promise<void> {
        const { model, year, brand } = req.body;

        if (!model || !year || !brand) {
            res.status(400).json({
                message: "Model, year and brand are required"
            });
            return;
        }

        try {
            const vehicle = await this.repository.create({ model, year, brand });

            res.status(201).json({
                message: "Vehicle created successfully",
                data: this.repository.toResponseObject(vehicle)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle already exists") {
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
            const vehicle = await this.repository.get(Number(id));

            res.status(200).json({
                data: this.repository.toResponseObject(vehicle)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle not found") {
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
            const vehicles = await this.repository.getAll();

            res.status(200).json({
                data: vehicles.map(vehicle => this.repository.toResponseObject(vehicle))
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
        const { model, year, brand } = req.body;

        if (!model || !year || !brand) {
            res.status(400).json({
                message: "Model, year and brand are required"
            });
            return;
        }

        try {
            const vehicle = await this.repository.update(Number(id), { model, year, brand });

            res.status(200).json({
                message: "Vehicle updated successfully",
                data: this.repository.toResponseObject(vehicle)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle not found") {
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
            const vehicle = await this.repository.delete(Number(id));

            res.status(200).json({
                message: "Vehicle deleted successfully",
                data: this.repository.toResponseObject(vehicle)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Vehicle not found") {
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
    async getByBrand(req: Request, res: Response): Promise<void> {
        const { brand } = req.params;

        try {
            const vehicles = await this.repository.getByBrand(brand);

            res.status(200).json({
                data: vehicles.map(vehicle => this.repository.toResponseObject(vehicle))
            });
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

            res.status(200).json({
                data: vehicles.map(vehicle => this.repository.toResponseObject(vehicle))
            });
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

            res.status(200).json({
                data: vehicles.map(vehicle => this.repository.toResponseObject(vehicle))
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
}