import { CustomerControllerService } from "../controllers/Customer.controller.service"
import express, { Request, Response } from "express"

export class CustomerRoutes {
    private controller: CustomerControllerService
    private router: express.Router

    constructor(
        controller: CustomerControllerService,
        router: express.Router
    ) {
        this.controller = controller
        this.router = router
    }

    initRoutes() {
        try {
            this.router.get("/customers", (req: Request, res: Response) => 
                this.controller.getAll(req, res))
            this.router.get("/customers/:id", (req: Request, res: Response) => 
                this.controller.getById(req, res))
            this.router.post("/customers", (req: Request, res: Response) => 
                this.controller.create(req, res))
            this.router.put("/customers/:id", (req: Request, res: Response) => 
                this.controller.update(req, res))
            this.router.delete("/customers/:id", (req: Request, res: Response) => 
                this.controller.delete(req, res))
            this.router.get("/customers/email/:email", (req: Request, res: Response) => 
                this.controller.getByEmail(req, res))
            this.router.get("/customers/document/:document", (req: Request, res: Response) => 
                this.controller.getByDocument(req, res))
            this.router.put("/customers/block/:id", (req: Request, res: Response) => 
                this.controller.blockCustomer(req, res))

            return this.router
        } catch (error) {
            throw new Error(`${error}`)
        }
    }
}