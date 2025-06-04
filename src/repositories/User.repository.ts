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

            // Verificar si el email ya existe
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email }
            });

            if (existingUser) {
                throw new Error("Email already exists");
            }
           
            const hashedPassword = await AuthService.hashPassword(user.password);
            
            const newUser = await prisma.user.create({
                data: {
                    email: user.email!,
                    name: user.name!,
                    password: hashedPassword,
                    role: user.role || "client",
                    updatedAt: new Date()
                }
            });

            const userWithRole: UserInterface = { 
                ...newUser, 
                role: newUser.role as (string | null) 
            };

            return userWithRole;
        } catch (error: any) {
            // Mejorar manejo de errores de Prisma
            if (error.code === 'P2002' || error.message.includes('Unique constraint')) {
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

            const userWithRole: UserInterface = { 
                ...user, 
                role: user.role as (string | null) 
            };
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

            const userWithRole: UserInterface = { 
                ...user, 
                role: user.role as (string | null) 
            };
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
            // Verificar que el usuario existe
            const existingUser = await prisma.user.findUnique({
                where: { id }
            });

            if (!existingUser) {
                throw new Error("User not found");
            }

            // Preparar datos para actualizar
            const dataToUpdate: any = {
                updatedAt: new Date()
            };

            // Solo actualizar campos que están presentes
            if (user.name !== undefined) dataToUpdate.name = user.name;
            if (user.email !== undefined) {
                // Verificar que el email no esté en uso por otro usuario
                if (user.email !== existingUser.email) {
                    const emailInUse = await prisma.user.findUnique({
                        where: { email: user.email }
                    });
                    if (emailInUse) {
                        throw new Error("Email already exists");
                    }
                }
                dataToUpdate.email = user.email;
            }
            if (user.password !== undefined) {
                dataToUpdate.password = await AuthService.hashPassword(user.password);
            }
            if (user.role !== undefined) dataToUpdate.role = user.role;

            const updatedUser = await prisma.user.update({
                where: { id },
                data: dataToUpdate,
            });

            const userWithRole: UserInterface = { 
                ...updatedUser, 
                role: updatedUser.role as (string | null) 
            };
            return userWithRole;

        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error("Email already exists");
            }
            if (error.code === 'P2025') {
                throw new Error("User not found");
            }
            throw error;
        }
    }

    async delete(id: number): Promise<UserInterface> {
        try {
            // Verificar que el usuario existe antes de intentar eliminarlo
            const existingUser = await prisma.user.findUnique({
                where: { id }
            });

            if (!existingUser) {
                throw new Error("User not found");
            }

            // Verificar si el usuario tiene bookings asociados
            const userBookings = await prisma.booking.findMany({
                where: { userId: id }
            });

            // Si tiene bookings, no se puede eliminar (opcional - depende de tu lógica de negocio)
            if (userBookings.length > 0) {
                throw new Error("Cannot delete user with existing bookings");
            }

            const deletedUser = await prisma.user.delete({
                where: { id }
            });

            const userWithRole: UserInterface = { 
                ...deletedUser, 
                role: deletedUser.role as (string | null) 
            };
            return userWithRole;

        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error("User not found");
            }
            if (error.code === 'P2003') {
                throw new Error("Cannot delete user with existing bookings");
            }
            throw error;
        }
    }

    toResponseObject(user: UserInterface): UserResponseInterface {
        const { id, name, email, createdAt, updatedAt, role } = user;
        return { 
            id: id!, 
            name, 
            email, 
            createdAt: createdAt!, 
            updatedAt: updatedAt!, 
            role: role 
        };
    }
}