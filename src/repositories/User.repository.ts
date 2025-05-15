
import { PrismaClient } from "../generated/prisma";
import { UserInterface, UserResponseInterface } from "../interfaces/User.interface";
import { UserRepositoryInterface } from "../interfaces/UserRepository.interface";
import { AuthService } from "../services/Auth.service";

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
                    updatedAt : new Date
                    
                }
            });

            return newUser;
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

            return user;
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

            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<UserInterface[]> {
        try {
            return await prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, user: Partial<UserInterface>): Promise<UserInterface> {
        try {

            if (user.password) {
                user.password = await AuthService.hashPassword(user.password);
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { ...user }
            });

            if (!updatedUser) {
                throw new Error("User not found");
            }

            return updatedUser;
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

            return deletedUser;
        } catch (error) {
            throw error;
        }
    }


    toResponseObject(user: UserInterface): UserResponseInterface {
        const { id, name, email, createdAt, updatedAt } = user;
        return { id: id!, name, email, createdAt: createdAt!, updatedAt: updatedAt! };
    }
}