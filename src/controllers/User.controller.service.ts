import { Request, Response } from "express";
import { UserRepository } from "../repositories/User.repository";
import { UserInterface } from "../interfaces/User.interface";

export class UserControllerService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async create(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                message: "Name, email and password are required"
            });
            return;
        }

        try {
            const user = await this.repository.create({ name, email, password });

            res.status(201).json({
                message: "User created successfully",
                data: this.repository.toResponseObject(user)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Email already exists") {
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
            const user = await this.repository.get(Number(id));

            res.status(200).json({
                data: this.repository.toResponseObject(user)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "User not found") {
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
            const users = await this.repository.getAll();
            
            res.status(200).json({
                data: users.map(user => this.repository.toResponseObject(user))
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
        const userData: Partial<UserInterface> = req.body;

        try {

            await this.repository.get(Number(id));

            const updatedUser = await this.repository.update(Number(id), userData);

            res.status(200).json({
                message: "User updated successfully",
                data: this.repository.toResponseObject(updatedUser)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "User not found") {
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
            const deletedUser = await this.repository.delete(Number(id));

            res.status(200).json({
                message: "User deleted successfully",
                data: this.repository.toResponseObject(deletedUser)
            });
        } catch (error) {
            if (error instanceof Error && error.message === "User not found") {
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

    async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {

            const user = (req as any).user;
            
            res.status(200).json({
                data: this.repository.toResponseObject(user)
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
}