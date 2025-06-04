import { CompanyInterface } from "../interfaces/Company.interface";
import { PrismaClient } from "../generated/prisma";

export class CompanyRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(companyData: CompanyInterface): Promise<CompanyInterface> {
        try {
            const company = await this.prisma.company.create({
                data: {
                    name: companyData.name,
                    description: companyData.description,
                    logo: companyData.logo,
                    website: companyData.website,
                    email: companyData.email,
                    phone: companyData.phone,
                    address: companyData.address
                }
            });
            return company;
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error("A company with this email already exists");
            }
            throw error;
        }
    }

    async get(): Promise<CompanyInterface | null> {
        const company = await this.prisma.company.findFirst();
        return company;
    }

    async update(companyData: Partial<CompanyInterface>): Promise<CompanyInterface | null> {
        const existingCompany = await this.prisma.company.findFirst();
        if (!existingCompany) {
            throw new Error("Company information not found");
        }

        const updatedCompany = await this.prisma.company.update({
            where: { id: existingCompany.id },
            data: companyData
        });
        return updatedCompany;
    }

    async delete(): Promise<void> {
        const existingCompany = await this.prisma.company.findFirst();
        if (existingCompany) {
            await this.prisma.company.delete({
                where: { id: existingCompany.id }
            });
        }
    }
} 