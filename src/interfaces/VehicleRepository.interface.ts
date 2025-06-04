import { Vehicle } from './Vehicle.interface';

export interface VehicleRepositoryInterface {

    create(vehicle: Partial<Vehicle>): Promise<Vehicle>;
    get(id: number): Promise<Vehicle>;
    getAll(): Promise<Vehicle[]>;
    update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle>;
    delete(id: number): Promise<Vehicle>;
    getByBrand(brand: string): Promise<Vehicle[]>;
    getByModel(model: string): Promise<Vehicle[]>;
    getByYear(year: number): Promise<Vehicle[]>;
    getByavailability(availability: string): Promise<Vehicle[]>;
    toResponseObject(vehicle: Vehicle | Vehicle[]): { data: Vehicle | Vehicle[] };
    

}
