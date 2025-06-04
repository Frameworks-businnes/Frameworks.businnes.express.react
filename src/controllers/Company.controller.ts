import { Request, Response } from "express";
import { CompanyRepository } from "../repositories/Company.repository";

export class CompanyController {
    private repository: CompanyRepository;

    constructor(repository: CompanyRepository) {
        this.repository = repository;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const company = await this.repository.create(req.body);
            res.status(201).json({
                message: "Company information created successfully",
                data: company
            });
        } catch (error: any) {
            if (error.message === "Company information already exists") {
                res.status(409).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Server error", error: error });
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const company = await this.repository.get();
            if (!company) {
                res.status(404).json({ message: "Company information not found" });
                return;
            }
            res.status(200).json({ data: company });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const company = await this.repository.update(req.body);
             if (!company) {
                // This case might be rare if update throws an error for not found,
                // but it's good practice to handle the possibility of a null return.
                res.status(404).json({ message: "Company information not found" });
                return;
            }
            res.status(200).json({
                message: "Company information updated successfully",
                data: company
            });
        } catch (error: any) {
             if (error.message === "Company information not found") {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Server error", error: error });
        }
    }

    // Delete method can be added later if needed
} 