import { PrismaClient } from '../generated/prisma';
import { VehicleInterface, VehicleResponseInterface } from '../interfaces/Vehicle.interface';
import { VehicleRepositoryInterface } from '../interfaces/VehicleRepository.interface';

const prisma = new PrismaClient();

export class VehicleRepository implements VehicleRepositoryInterface {
    async create(vehicle: Partial<VehicleInterface>): Promise<VehicleInterface> {
        try {
            const newVehicle = await prisma.vehicle.create({
                data: {
                    model: vehicle.model!,
                    year: vehicle.year!,
                    brand: vehicle.brand!,
                    availability: vehicle.availability || 'available' // Default to 'available' if not provided
                }
            });

            return newVehicle;
        } catch (error) {
            throw error;
        }
    }

    async get(id: number): Promise<VehicleInterface> {
        try {
            const vehicle = await prisma.vehicle.findUnique({ where: { id } });
            if (!vehicle) {
                throw new Error(`Vehicle with id ${id} not found`);
            }
            return vehicle;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<VehicleInterface[]> {
        try {
            return await prisma.vehicle.findMany();
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, vehicle: Partial<VehicleInterface>): Promise<VehicleInterface> {
        try {
            return await prisma.vehicle.update({
                where: { id },
                data: vehicle,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<VehicleInterface> {
        try {
            const deletedVehicle = await prisma.vehicle.delete({ where: { id } });
            return deletedVehicle;
        } catch (error) {
            throw error;
        }
    }

    async getByBrand(brand: string): Promise<VehicleInterface[]> {
        try {
            return await prisma.vehicle.findMany({ where: { brand } });
        } catch (error) {
            throw error;
        }
    }

    async getByModel(model: string): Promise<VehicleInterface[]> {
        try {
            return await prisma.vehicle.findMany({ where: { model } });
        } catch (error) {
            throw error;
        }
    }

    async getByYear(year: number): Promise<VehicleInterface[]> {
        try {
            return await prisma.vehicle.findMany({ where: { year } });
        } catch (error) {
            throw error;
        }
    }

    async getByavailability(availability: string): Promise<VehicleInterface[]> {
        try {
            return await prisma.vehicle.findMany({ where: { availability } });
        } catch (error) {
            throw error;
        }
    }

    toResponseObject(vehicle: VehicleInterface): VehicleResponseInterface {
        const { id, model, year, brand, availability } = vehicle;
        return { id: id!, model, year, brand, availability };
    }
}



