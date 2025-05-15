import express, { Request, Response } from 'express';
import { AuthControllerService } from '../controllers/Auth.controller.service';

export class AuthRoutes {
    private controller: AuthControllerService;
    private router: express.Router;

    constructor(
        controller: AuthControllerService,
        router: express.Router
    ) {
        this.controller = controller;
        this.router = router;
    }

    initRoutes() {
        try {
            
            this.router.post("/login", (req: Request, res: Response) => this.controller.login(req, res));
            this.router.post("/logout", (req: Request, res: Response) => this.controller.logout(req, res));

            return this.router;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}