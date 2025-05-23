import { Request, Response } from "express"
import { CustomerRepository } from "../repositories/Customer.repository" 
import { CustomerInterface } from "../interfaces/Customer.interface"

export class CustomerControllerService {
    private repository: CustomerRepository

    constructor(repository: CustomerRepository) {
        this.repository = repository
    }

    async create(req: Request, res: Response): Promise<void> {
        const { name, lastname, document, type_document, phone, email, is_foreign } = req.body

        if (!name || !lastname || !document || !type_document || !phone || !email || !is_foreign) {
            res.status(400).json({ message: "Missing required fields" })
            return
        }

        try {
            const existingEmail = await this.repository.getByEmail(email)

            if (existingEmail) {
                res.status(400).json({ message: "Email already exists" })
                return
            }

            const existingDocument = await this.repository.getByDocument(document)

            if (existingDocument) {
                res.status(400).json({ message: "Document already exists" })
                return 
            }

            const customer = await this.repository.create({
                name,
                lastname,
                document,
                type_document,
                phone,
                email,
                is_foreign
            })


            res.status(201).json({
                message: "Customer created successfully",
                customer: this.repository.toResponseObject(customer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error creating customer",
                error: errorMessage 
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const customer = await this.repository.get(Number(id))

            if (!customer) {
                res.status(404).json({ message: "Customer not found" })
                return
            }

            res.status(200).json({
                message: "Customer found",
                customer: this.repository.toResponseObject(customer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error getting customer",
                error: errorMessage 
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const customers = await this.repository.getAll()

            res.status(200).json({
                message: "Customers found",
                customers: customers.map(customer => this.repository.toResponseObject(customer))
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error getting customers",
                error: errorMessage 
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const customerData: Partial<CustomerInterface> = req.body

        try {
            const customer = await this.repository.get(Number(id))

            if (!customer) {
                res.status(404).json({ message: "Customer not found" })
                return
            }

            const updatedCustomer = await this.repository.update(Number(id), customerData)

            res.status(200).json({
                message: "Customer updated successfully",
                customer: this.repository.toResponseObject(updatedCustomer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error updating customer",
                error: errorMessage 
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const customer = await this.repository.get(Number(id))

            if (!customer) {
                res.status(404).json({ message: "Customer not found" })
                return
            }

            const deletedCustomer = await this.repository.delete(Number(id))

            res.status(200).json({
                message: "Customer deleted successfully",
                customer: this.repository.toResponseObject(deletedCustomer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error deleting customer",
                error: errorMessage 
            });
        }
    }

    async blockCustomer(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const customer = await this.repository.get(Number(id))

            if (!customer) {
                res.status(404).json({ message: "Customer not found" })
                return
            }

            const blockedCustomer = await this.repository.blockCustomer(Number(id))

            res.status(200).json({
                message: "Customer blocked successfully",
                customer: this.repository.toResponseObject(blockedCustomer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error blocking customer",
                error: errorMessage 
            });
        }
    }

    async getByEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params

        try {
            const customer = await this.repository.getByEmail(email)

            if (!customer) {
                res.status(404).json({ message: "Customer not found" })
                return
            }

            res.status(200).json({
                message: "Customer found",
                customer: this.repository.toResponseObject(customer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error getting customer",
                error: errorMessage 
            });
        }
    }

    async getByDocument(req: Request, res: Response): Promise<void> {
        const { document } = req.params

        try {
            const customer = await this.repository.getByDocument(document)

            if (!customer) {
                res.status(404).json({ message: "Customer not found" })
                return
            }

            res.status(200).json({
                message: "Customer found",
                customer: this.repository.toResponseObject(customer)
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ 
                message: "Error getting customer",
                error: errorMessage 
            });
        }
    }
}