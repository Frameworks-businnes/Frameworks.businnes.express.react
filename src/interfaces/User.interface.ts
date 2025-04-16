export interface UserInterface {
    id?: number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserResponseInterface {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginRequestInterface {
    email: string;
    password: string;
}

export interface LoginResponseInterface {
    user: UserResponseInterface;
    token: string;
}