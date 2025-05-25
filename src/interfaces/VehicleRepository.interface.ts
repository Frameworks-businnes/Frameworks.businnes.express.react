import { VehicleInterface } from './Vehicle.interface';

export interface VehicleRepositoryInterface {

    create(vehicle: Partial<VehicleInterface>): Promise<VehicleInterface>;
    get(id: number): Promise<VehicleInterface>;
    getAll(): Promise<VehicleInterface[]>;
    update(id: number, vehicle: Partial<VehicleInterface>): Promise<VehicleInterface>;
    delete(id: number): Promise<VehicleInterface>;
    getByBrand(brand: string): Promise<VehicleInterface[]>;
    getByModel(model: string): Promise<VehicleInterface[]>;
    getByYear(year: number): Promise<VehicleInterface[]>;
    getByavailability(availability: string): Promise<VehicleInterface[]>;
    

}
