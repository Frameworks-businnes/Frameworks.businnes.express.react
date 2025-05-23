export interface Customer {
    id?: number;
    name: string;
    lastname: string;
    document: string;
    type_document: string;
    phone: string;
    email: string;
    is_foreign: boolean;
    is_blocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CustomerResponseInterface {
    id?: number;
    name: string;
    lastname: string;
    document: string;
    type_document: string;
    phone: string;
    email: string;
    is_foreign: boolean;
    is_blocked: boolean;
}