import { PrismaClient } from "../generated/prisma";
import { UserInterface, UserResponseInterface } from "../interfaces/User.interface";
import { UserRepositoryInterface } from "../interfaces/UserRepository.interface";
import { AuthService } from "../services/Auth.service";
import { UserRole } from "../middlewares/Role.middleware";

const prisma = new PrismaClient();

export class UserRepository implements UserRepositoryInterface {
    async create(user: Partial<UserInterface>): Promise<UserInterface> {
        try {
            if (!user.password) {
                throw new Error("Password is required");
            }
           
            const hashedPassword = await AuthService.hashPassword(user.password);
            
            const newUser = await prisma.user.create({
                data: {
                    email: user.email!,
                    name: user.name!,
                    password: hashedPassword,
                    role: user.role || "client",
                    updatedAt : new Date
                    
                }
            });

            const userWithRole: UserInterface = { ...newUser, role: newUser.role as (string | null) };

            return userWithRole;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                throw new Error("Email already exists");
            }
            throw error;
        }
    }

    async get(id: number): Promise<UserInterface> {
        try {
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                throw new Error("User not found");
            }

            const userWithRole: UserInterface = { ...user, role: user.role as (string | null) };
            return userWithRole;

        } catch (error) {
            throw error;
        }
    }

    async getByEmail(email: string): Promise<UserInterface> {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new Error("User not found");
            }

            const userWithRole: UserInterface = { ...user, role: user.role as (string | null) };
            return userWithRole;

        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<UserInterface[]> {
        try {
            const users = await prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });

            const usersWithRole: UserInterface[] = users.map(user => ({
                ...user, 
                role: user.role as (string | null)
            }));

            return usersWithRole;

        } catch (error) {
            throw error;
        }
    }

    async update(id: number, user: Partial<UserInterface>): Promise<UserInterface> {
        try {

            if (user.password) {
                user.password = await AuthService.hashPassword(user.password);
            }

            const dataToUpdate: any = { ...user };
            delete dataToUpdate.role;

            if (user.role !== undefined && user.role !== null) {
                dataToUpdate.role = user.role;
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: dataToUpdate,
            });

            if (!updatedUser) {
                throw new Error("User not found");
            }

            const userWithRole: UserInterface = { ...updatedUser, role: updatedUser.role as (string | null) };
            return userWithRole;

        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<UserInterface> {
        try {
            const deletedUser = await prisma.user.delete({
                where: { id }
            });

            if (!deletedUser) {
                throw new Error("User not found");
            }

            const userWithRole: UserInterface = { ...deletedUser, role: deletedUser.role as (string | null) };
            return userWithRole;

        } catch (error) {
            throw error;
        }
    }

    toResponseObject(user: UserInterface): UserResponseInterface {
        const { id, name, email, createdAt, updatedAt, role } = user;
        return { id: id!, name, email, createdAt: createdAt!, updatedAt: updatedAt!, role: role };
    }
}