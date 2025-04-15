import { UserInterface } from "./User.interface";



export interface UserRepositoryInterface {

    create(user:Partial<UserInterface>):Promise<UserInterface>;
    get(id:number):Promise<UserInterface>;
    getAll():Promise<UserInterface[]>;
    update(id:number, user:Partial<UserInterface>):Promise<UserInterface>;
    delete(id:number):Promise<UserInterface>;

}