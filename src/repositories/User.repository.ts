import { PrismaClient } from "@prisma/client";
import { UserInterface } from "../interfaces/User.interface";
import { UserRepositoryInterface } from "../interfaces/UserRepository.interface";


const prisma = new PrismaClient()

export class UserRepository implements UserRepositoryInterface {

    async create(user: Partial<UserInterface>): Promise<UserInterface> {
        try {
            
            const newUser = await prisma.user.create(user)

            return newUser

        } catch (error) {
            throw new Error(`${error}`);
            
        }
    }
    get(id: number): Promise<UserInterface> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<UserInterface[]> {
        throw new Error("Method not implemented.");
    }
    update(id: number, user: Partial<UserInterface>): Promise<UserInterface> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<UserInterface> {
        throw new Error("Method not implemented.");
    }

}