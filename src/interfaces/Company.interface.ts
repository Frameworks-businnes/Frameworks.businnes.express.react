export interface CompanyInterface {
    id?: number;
    name: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    createdAt?: Date;
    updatedAt?: Date;
} 