import { PrismaClient } from '../generated/prisma';
import { CustomerInterface, CustomerResponseInterface } from '../interfaces/Customer.interface';
import { CustomerRepositoryInterface } from '../interfaces/CustomerRepository.interface';

const prisma = new PrismaClient();

export class CustomerRepository implements CustomerRepositoryInterface {

    async create(customer: Partial<CustomerInterface>): Promise<CustomerInterface> {
        try {
            const newCustomer = await prisma.customer.create({
                data: {
                    name: customer.name!,
                    lastname: customer.lastname!,
                    document: customer.document!,
                    type_document: customer.type_document!,
                    phone: customer.phone!,
                    email: customer.email!,
                    is_foreign: customer.is_foreign!,
                    is_blocked: customer.is_blocked!,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            })

            return newCustomer;
        } catch (error) {
            throw error;
        }
    }

    async get(id: number): Promise<CustomerInterface> {
        try {
            const customer = await prisma.customer.findUnique({ 
                where: { id } 
            });

            if (!customer){
                throw new Error("Customer not found")
            }

            return customer
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<CustomerInterface[]> {
        try {
            return await prisma.customer.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            })
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, customer: Partial<CustomerInterface>): Promise<CustomerInterface> {
        try {
            const updatedCustomer = await prisma.customer.update({
                where: { id },
                data: customer
            })

            if (!updatedCustomer){
                throw new Error("Customer not found")
            }

            return updatedCustomer
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<CustomerInterface> {
        try {
            const deletedCustomer = await prisma.customer.delete({
                where: { id }
            })

            if (!deletedCustomer){
                throw new Error("Customer not found")
            }

            return deletedCustomer
        } catch (error) {
            throw error
        }
    }

    async getByEmail(email: string): Promise<CustomerInterface> {
        try {
            const customer = await prisma.customer.findUnique({
                where: { email }
            })

            if (!customer){
                throw new Error("Customer not found")
            }

            return customer
        } catch (error) {
            throw error
        }
    }

    async getByDocument(document: string): Promise<CustomerInterface> {
        try {
            const customer = await prisma.customer.findUnique({
                where: { document }
            })

            if (!customer){
                throw new Error("Customer not found")
            }

            return customer
        } catch (error) {
            throw error
        }
    }

    toResponseObject(customer: CustomerInterface): CustomerResponseInterface {
        const { id, name, lastname, document, type_document, phone, email, is_foreign, is_blocked, createdAt, updatedAt } = customer;
        return { id: id!, name, lastname, document, type_document, phone, email, is_foreign, is_blocked, createdAt: createdAt!, updatedAt: updatedAt! };
    }
}