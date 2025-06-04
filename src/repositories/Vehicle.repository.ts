import { PrismaClient } from '../generated/prisma';
import { Vehicle, VehicleResponse } from "../interfaces/Vehicle.interface";
import { VehicleRepositoryInterface } from '../interfaces/VehicleRepository.interface';

const prisma = new PrismaClient();

function fixVehicleNulls(vehicle: any): Vehicle {
    return {
        ...vehicle,
        price: vehicle.price ?? 0,
        imageUrl: vehicle.imageUrl ?? '',
    };
}

export class VehicleRepository implements VehicleRepositoryInterface {
    async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
        try {
            const newVehicle = await prisma.vehicle.create({
                data: {
                    model: vehicle.model!,
                    year: vehicle.year!,
                    brand: vehicle.brand!,
                    price: vehicle.price ?? 0,
                    imageUrl: vehicle.imageUrl ?? '',
                }
            });
            return fixVehicleNulls(newVehicle);
        } catch (error) {
            throw error;
        }
    }

    async get(id: number): Promise<Vehicle> {
        try {
            const vehicle = await prisma.vehicle.findUnique({ where: { id } });
            if (!vehicle) {
                throw new Error(`Vehicle with id ${id} not found`);
            }
            return fixVehicleNulls(vehicle);
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany();
            return vehicles.map(fixVehicleNulls);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
        try {
            const updated = await prisma.vehicle.update({
                where: { id },
                data: {
                    model: vehicle.model,
                    year: vehicle.year,
                    brand: vehicle.brand,
                    availability: vehicle.availability,
                    price: vehicle.price,
                    imageUrl: vehicle.imageUrl,
                },
            });
            return fixVehicleNulls(updated);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<Vehicle> {
        try {
            const deletedVehicle = await prisma.vehicle.delete({ where: { id } });
            return fixVehicleNulls(deletedVehicle);
        } catch (error) {
            throw error;
        }
    }

    async getByBrand(brand: string): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ where: { brand } });
            return vehicles.map(fixVehicleNulls);
        } catch (error) {
            throw error;
        }
    }

    async getByModel(model: string): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ where: { model } });
            return vehicles.map(fixVehicleNulls);
        } catch (error) {
            throw error;
        }
    }

    async getByYear(year: number): Promise<Vehicle[]> {
        try {
            const vehicles = await prisma.vehicle.findMany({ where: { year } });
            return vehicles.map(fixVehicleNulls);
        } catch (error) {
            throw error;
        }
    }

    async getByavailability(availability: string): Promise<Vehicle[]> {
        try {
            // Since availability is not in the Prisma schema, we'll return all vehicles
            const vehicles = await prisma.vehicle.findMany();
            return vehicles.map(fixVehicleNulls);
        } catch (error) {
            throw error;
        }
    }

    toResponseObject(vehicle: Vehicle | Vehicle[]): VehicleResponse {
        return { data: vehicle };
    }
}



