import { PrismaClient } from '../generated/prisma';
import { Vehicle, VehicleResponse } from "../interfaces/Vehicle.interface";
import { VehicleRepositoryInterface } from '../interfaces/VehicleRepository.interface';

const prisma = new PrismaClient();

function fixVehicleNulls(vehicle: any): Vehicle {
    return {
        ...vehicle,
        price: vehicle.price ?? 0,
        imageUrl: vehicle.imageUrl ?? '',
        availability: vehicle.availability ?? 'available'
    };
}

export class VehicleRepository {
    async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
        try {
            const newVehicle = await prisma.vehicle.create({
                data: {
                    model: vehicle.model!,
                    year: vehicle.year!,
                    brand: vehicle.brand!,
                    availability: vehicle.availability || 'available',
                    price: vehicle.price ?? 0,
                    imageUrl: vehicle.imageUrl ?? '',
                    updatedAt: new Date()
                }
            });
            return fixVehicleNulls(newVehicle);
        } catch (error: any) {
            console.error('Error creating vehicle:', error);
            throw error;
        }
    }

    async get(id: number): Promise<Vehicle> {
        try {
            const vehicle = await prisma.vehicle.findUnique({ 
                where: { id } 
            });
            
            if (!vehicle) {
                throw new Error("Vehicle not found");
            }
            
            return fixVehicleNulls(vehicle);
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return vehicles.map(fixVehicleNulls);
        } catch (error: any) {
            console.error('Error getting all vehicles:', error);
            throw error;
        }
    }

    async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
        try {
            // Verificar que el vehículo existe
            const existingVehicle = await prisma.vehicle.findUnique({
                where: { id }
            });

            if (!existingVehicle) {
                throw new Error("Vehicle not found");
            }

            // Preparar datos para actualizar solo los campos que están presentes
            const dataToUpdate: any = {
                updatedAt: new Date()
            };

            if (vehicle.model !== undefined) dataToUpdate.model = vehicle.model;
            if (vehicle.year !== undefined) dataToUpdate.year = vehicle.year;
            if (vehicle.brand !== undefined) dataToUpdate.brand = vehicle.brand;
            if (vehicle.availability !== undefined) dataToUpdate.availability = vehicle.availability;
            if (vehicle.price !== undefined) dataToUpdate.price = vehicle.price;
            if (vehicle.imageUrl !== undefined) dataToUpdate.imageUrl = vehicle.imageUrl;

            const updated = await prisma.vehicle.update({
                where: { id },
                data: dataToUpdate,
            });

            return fixVehicleNulls(updated);
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error("Vehicle not found");
            }
            console.error('Error updating vehicle:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<Vehicle> {
        try {
            // Verificar que el vehículo existe
            const existingVehicle = await prisma.vehicle.findUnique({
                where: { id }
            });

            if (!existingVehicle) {
                throw new Error("Vehicle not found");
            }

            // Verificar si el vehículo tiene bookings asociados
            const vehicleBookings = await prisma.booking.findMany({
                where: { vehicleId: id }
            });

            // Si tiene bookings activos, no se puede eliminar
            if (vehicleBookings.length > 0) {
                throw new Error("Cannot delete vehicle with existing bookings");
            }

            const deletedVehicle = await prisma.vehicle.delete({ 
                where: { id } 
            });
            
            return fixVehicleNulls(deletedVehicle);
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error("Vehicle not found");
            }
            if (error.code === 'P2003') {
                throw new Error("Cannot delete vehicle with existing bookings");
            }
            console.error('Error deleting vehicle:', error);
            throw error;
        }
    }

    async getByBrand(brand: string): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ 
                where: { 
                    brand: {
                        contains: brand,
                        // @ts-ignore
                        mode: 'insensitive'
                    }
                } 
            });
            return vehicles.map(fixVehicleNulls);
        } catch (error: any) {
            console.error('Error getting vehicles by brand:', error);
            throw error;
        }
    }

    async getByModel(model: string): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ 
                where: { 
                    model: {
                        contains: model,
                        // @ts-ignore
                        mode: 'insensitive'
                    }
                } 
            });
            return vehicles.map(fixVehicleNulls);
        } catch (error: any) {
            console.error('Error getting vehicles by model:', error);
            throw error;
        }
    }

    async getByYear(year: number): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ 
                where: { year } 
            });
            return vehicles.map(fixVehicleNulls);
        } catch (error: any) {
            console.error('Error getting vehicles by year:', error);
            throw error;
        }
    }

    async getByAvailability(availability: string): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ 
                where: { availability } 
            });
            return vehicles.map(fixVehicleNulls);
        } catch (error: any) {
            console.error('Error getting vehicles by availability:', error);
            throw error;
        }
    }

    toResponseObject(vehicle: Vehicle | Vehicle[]): VehicleResponse {
        return { data: vehicle };
    }
}