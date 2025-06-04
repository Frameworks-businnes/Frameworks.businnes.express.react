import { CompanyController } from "../controllers/Company.controller";
import express, { Request, Response } from 'express';

export class CompanyRoutes {
    private controller: CompanyController;
    private router: express.Router;

    constructor(
        controller: CompanyController,
        router: express.Router
    ){
        this.controller = controller;
        this.router = router;
    }

    initRoutes(){
        try {
            // Public routes for company information (can be restricted later if needed)
            this.router.post("/company", (req: Request, res: Response) => this.controller.create(req, res));
            this.router.get("/company", (req: Request, res: Response) => this.controller.get(req, res));
            this.router.put("/company", (req: Request, res: Response) => this.controller.update(req, res));

            return this.router;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
} 