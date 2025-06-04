export interface Vehicle {
    id?: number;
    model: string;
    year: number;
    brand: string;
    availability: string;
    price: number;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VehicleResponse {
    message?: string;
    data: Vehicle | Vehicle[];
}
