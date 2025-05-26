import { CustomerInterface } from "./Customer.interface"

export interface CustomerRepositoryInterface {
    create(customer: Partial<CustomerInterface>): Promise<CustomerInterface>;
    get(id: number): Promise<CustomerInterface>;
    getAll(): Promise<CustomerInterface[]>;
    update(id: number, customer: Partial<CustomerInterface>): Promise<CustomerInterface>;
    delete(id: number): Promise<CustomerInterface>;
}