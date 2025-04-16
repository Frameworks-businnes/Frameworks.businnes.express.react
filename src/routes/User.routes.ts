import { UserControllerService } from "../controllers/User.controller.service";
import express, { Request, Response } from 'express';
import { AuthMiddleware } from "../middlewares/Auth.middleware";

export class UserRoutes {
    private controller: UserControllerService;
    private router: express.Router;
    private authMiddleware: AuthMiddleware;

    constructor(
        controller: UserControllerService,
        router: express.Router,
        authMiddleware: AuthMiddleware
    ){
        this.controller = controller;
        this.router = router;
        this.authMiddleware = authMiddleware;
    }

    initRoutes(){
        try {
            // Public routes
            this.router.post("/users", (req: Request, res: Response) => this.controller.create(req, res));
            
            // Protected routes
            this.router.get("/users", this.authMiddleware.authenticate, (req: Request, res: Response) => 
                this.controller.getAll(req, res));
            
            this.router.get("/users/me", this.authMiddleware.authenticate, (req: Request, res: Response) => 
                this.controller.getCurrentUser(req, res));
            
            this.router.get("/users/:id", this.authMiddleware.authenticate, (req: Request, res: Response) => 
                this.controller.getById(req, res));
            
            this.router.put("/users/:id", this.authMiddleware.authenticate, (req: Request, res: Response) => 
                this.controller.update(req, res));
            
            this.router.delete("/users/:id", this.authMiddleware.authenticate, (req: Request, res: Response) => 
                this.controller.delete(req, res));

            return this.router;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}