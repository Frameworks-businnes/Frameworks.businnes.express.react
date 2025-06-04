import { CompanyInterface } from "../interfaces/Company.interface";

export class CompanyRepository {
    // In-memory storage for simplicity. Replace with actual database logic.
    private company: CompanyInterface | null = null;

    async create(companyData: CompanyInterface): Promise<CompanyInterface> {
        // In a real application, this would save to a database
        if (this.company) {
            throw new Error("Company information already exists");
        }
        this.company = { id: 1, ...companyData }; // Assign a simple ID
        console.log("Company created:", this.company);
        return this.company;
    }

    async get(): Promise<CompanyInterface | null> {
        // In a real application, this would fetch from a database
        console.log("Fetching company:", this.company);
        return this.company;
    }

    async update(companyData: Partial<CompanyInterface>): Promise<CompanyInterface | null> {
        // In a real application, this would update in a database
        if (!this.company) {
            throw new Error("Company information not found");
        }
        this.company = { ...this.company, ...companyData };
        console.log("Company updated:", this.company);
        return this.company;
    }

    // In a real application, you might also have a delete method
} 