import { Request, Response, NextFunction } from 'express';
import { User } from '../interfaces/User.interface';

export enum UserRole {
    ADMIN = 'admin',
    SECRETARY = 'secretary',
    CLIENT = 'client'
}

export const checkRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as User;

        if (!user) {
            res.status(401).json({
                message: 'Unauthorized - No user found'
            });
            return;
        }

        if (!roles.includes(user.role as UserRole)) {
            res.status(403).json({
                message: 'Forbidden - Insufficient permissions'
            });
            return;
        }

        next();
        return;
    };
}; 