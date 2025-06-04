import { Request, Response } from "express";
import { UserRepository } from "../repositories/User.repository";
import { UserInterface } from "../interfaces/User.interface";

export class UserControllerService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            // Validar que req.body existe y no está vacío
            if (!req.body || Object.keys(req.body).length === 0) {
                res.status(400).json({
                    message: "Request body is required"
                });
                return;
            }

            const { name, email, password, role } = req.body;

            // Validaciones más estrictas
            if (!name || typeof name !== 'string' || name.trim() === '') {
                res.status(400).json({
                    message: "Name is required and must be a valid string"
                });
                return;
            }

            if (!email || typeof email !== 'string' || !email.includes('@')) {
                res.status(400).json({
                    message: "Valid email is required"
                });
                return;
            }

            if (!password || typeof password !== 'string' || password.length < 6) {
                res.status(400).json({
                    message: "Password is required and must be at least 6 characters"
                });
                return;
            }

            const userData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                role: role || 'client'
            };

            const user = await this.repository.create(userData);

            res.status(201).json({
                message: "User created successfully",
                data: this.repository.toResponseObject(user)
            });
        } catch (error: any) {
            console.error('Error creating user:', error);
            
            if (error.message === "Email already exists") {
                res.status(409).json({
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error.message || "Internal server error"
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        // Validar ID
        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                message: "Valid user ID is required"
            });
            return;
        }

        try {
            const user = await this.repository.get(Number(id));

            res.status(200).json({
                data: this.repository.toResponseObject(user)
            });
        } catch (error: any) {
            console.error('Error getting user by ID:', error);
            
            if (error.message === "User not found") {
                res.status(404).json({
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error.message || "Internal server error"
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.repository.getAll();
            
            res.status(200).json({
                data: users.map(user => this.repository.toResponseObject(user))
            });
        } catch (error: any) {
            console.error('Error getting all users:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || "Internal server error"
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        // Validar ID
        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                message: "Valid user ID is required"
            });
            return;
        }

        // Validar que req.body existe
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({
                message: "At least one field is required to update"
            });
            return;
        }

        try {
            const { name, email, password, role } = req.body;
            const userData: Partial<UserInterface> = {};

            // Solo agregar campos que están presentes y son válidos
            if (name !== undefined) {
                if (typeof name !== 'string' || name.trim() === '') {
                    res.status(400).json({
                        message: "Name must be a valid string"
                    });
                    return;
                }
                userData.name = name.trim();
            }

            if (email !== undefined) {
                if (typeof email !== 'string' || !email.includes('@')) {
                    res.status(400).json({
                        message: "Email must be a valid email address"
                    });
                    return;
                }
                userData.email = email.trim().toLowerCase();
            }

            if (password !== undefined) {
                if (typeof password !== 'string' || password.length < 6) {
                    res.status(400).json({
                        message: "Password must be at least 6 characters"
                    });
                    return;
                }
                userData.password = password;
            }

            if (role !== undefined) {
                if (typeof role !== 'string') {
                    res.status(400).json({
                        message: "Role must be a valid string"
                    });
                    return;
                }
                userData.role = role;
            }

            const updatedUser = await this.repository.update(Number(id), userData);

            res.status(200).json({
                message: "User updated successfully",
                data: this.repository.toResponseObject(updatedUser)
            });
        } catch (error: any) {
            console.error('Error updating user:', error);
            
            if (error.message === "User not found") {
                res.status(404).json({
                    message: error.message
                });
                return;
            }

            if (error.message === "Email already exists") {
                res.status(409).json({
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error.message || "Internal server error"
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        // Validar ID
        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                message: "Valid user ID is required"
            });
            return;
        }

        try {
            console.log(`Attempting to delete user with ID: ${id}`);
            
            const deletedUser = await this.repository.delete(Number(id));

            console.log(`User deleted successfully: ${deletedUser.id}`);

            res.status(200).json({
                message: "User deleted successfully",
                data: this.repository.toResponseObject(deletedUser)
            });
        } catch (error: any) {
            console.error('Error deleting user:', error);
            
            if (error.message === "User not found") {
                res.status(404).json({
                    message: error.message
                });
                return;
            }

            if (error.message === "Cannot delete user with existing bookings") {
                res.status(409).json({
                    message: "Cannot delete user with existing bookings. Please remove all bookings first."
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error.message || "Internal server error"
            });
        }
    }

    async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            
            if (!user) {
                res.status(401).json({
                    message: "No authenticated user found"
                });
                return;
            }
            
            res.status(200).json({
                data: this.repository.toResponseObject(user)
            });
        } catch (error: any) {
            console.error('Error getting current user:', error);
            res.status(500).json({
                message: "Server error",
                error: error.message || "Internal server error"
            });
        }
    }
}