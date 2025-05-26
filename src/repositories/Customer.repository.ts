import { PrismaClient } from '../generated/prisma';
import { CustomerInterface, CustomerResponseInterface } from '../interfaces/Customer.interface';
import { CustomerRepositoryInterface } from '../interfaces/CustomerRepository.interface';

const prisma = new PrismaClient();

export class CustomerRepository implements CustomerRepositoryInterface {

    async create(customer: Partial<CustomerInterface>): Promise<CustomerInterface> {
        try {
            if (!customer.name || !customer.lastname || !customer.document || 
                !customer.type_document || !customer.phone || !customer.email || 
                customer.is_foreign === undefined) {
                throw new Error("Faltan campos requeridos");
            }

            const newCustomer = await prisma.customer.create({
                data: {
                    name: customer.name,
                    lastname: customer.lastname,
                    document: customer.document,
                    type_document: customer.type_document,
                    file_document: customer.file_document || "", 
                    license: customer.license || "",
                    phone: customer.phone,
                    email: customer.email,
                    is_foreign: Boolean(customer.is_foreign),       // Conversión explícita a booleano
                    is_blocked: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            return newCustomer;
        } catch (error) {
            throw error
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
            customer.updatedAt = new Date();
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

    async updateDocument(id: number, file_document: string): Promise<CustomerInterface> {
        try {
            const updatedCustomer = await prisma.customer.update({
                where: { id },
                data: { 
                    file_document,
                    updatedAt: new Date()
                }
            })
            if (!updatedCustomer){
                throw new Error("Customer not found")
            }

            return updatedCustomer
        } catch (error) {
            throw error
        }
    }

    async updateLicense(id: number, license: string): Promise<CustomerInterface> {
        try {
            const updatedCustomer = await prisma.customer.update({
                where: { id },
                data: { 
                    license,
                    updatedAt: new Date()
                }
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

    async getByEmail(email: string): Promise<CustomerInterface | null> {
        try {
            const customer = await prisma.customer.findUnique({
                where: { email }
            })
            return customer
        } catch (error) {
            throw error
        }
    }

    async getByDocument(document: string): Promise<CustomerInterface | null> {
        try {
            const customer = await prisma.customer.findUnique({
                where: { document }
            })
            return customer
        } catch (error) {
            throw error
        }
    }

    async blockCustomer(id: number): Promise<CustomerInterface> {
        try {
            const customer = await prisma.customer.update({
                where: { id },
                data: { 
                    is_blocked: true,
                    updatedAt: new Date()
                }
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
        const { id, name, lastname, document, type_document, file_document, license, phone, email, is_foreign, is_blocked, createdAt, updatedAt } = customer;
        return { id: id!, name, lastname, document, type_document, file_document, license, phone, email, is_foreign, is_blocked, createdAt: createdAt!, updatedAt: updatedAt! };
    }
}