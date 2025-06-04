import { UserRole } from '../middlewares/Role.middleware';
import { Request } from 'express';

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: string | null;
}

export interface UserResponse {
    message?: string;
    data: User | User[];
}

export interface UserInterface {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserResponseInterface {
    id: number;
    name: string;
    email: string;
    role: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginRequestInterface {
    email: string;
    password: string;
}

export interface LoginResponseInterface {
    user: UserResponseInterface;
    token: string;
}

// Extiende la interfaz Request de Express para incluir la propiedad user
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}