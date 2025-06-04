import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/Auth.service";
import { UserRepository } from "../repositories/User.repository";

export class AuthMiddleware {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies.token;

            if (!token) {
                res.status(401).json({
                    message: "Authentication required"
                });
                return;
            }

            try {
                const decoded = AuthService.verifyToken(token);
                const user = await this.userRepository.get(decoded.userId);
                (req as any).user = user;
                next();
                return;
            } catch (error) {
                res.clearCookie('token');
                res.status(401).json({
                    message: "Invalid or expired token"
                });
                return;
            }
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error
            });
            return;
        }
    };
}