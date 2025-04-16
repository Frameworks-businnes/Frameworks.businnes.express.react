import { Request, Response } from "express";
import { UserRepository } from "../repositories/User.repository";
import { AuthService } from "../services/Auth.service";
import { LoginRequestInterface } from "../interfaces/User.interface";

export class AuthControllerService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: LoginRequestInterface = req.body;

            if (!email || !password) {
                res.status(400).json({
                    message: "Email and password are required"
                });
                return;
            }


            const user = await this.repository.getByEmail(email);

            const isPasswordValid = await AuthService.comparePasswords(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    message: "Invalid credentials"
                });
                return;
            }

            const token = AuthService.generateToken({
                userId: user.id!,
                email: user.email
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(200).json({
                message: "Login successful",
                data: {
                    user: this.repository.toResponseObject(user),
                    token
                }
            });
        } catch (error) {
            if (error instanceof Error && error.message === "User not found") {
                res.status(401).json({
                    message: "Invalid credentials"
                });
                return;
            }

            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {

            res.clearCookie('token');
            
            res.status(200).json({
                message: "Logout successful"
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }
    }
}