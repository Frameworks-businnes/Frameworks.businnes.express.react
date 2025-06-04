import { VehicleControllerService } from "../controllers/Vehicle.controller.service";
import * as express from "express";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
import { checkRole, UserRole } from "../middlewares/Role.middleware";
import { upload } from "../middlewares/Upload.middleware";
// import { Request, Response } from "express";

export class VehicleRoutes {
    private controller: VehicleControllerService;
    private router: express.Router;
    private middlewareAuth: AuthMiddleware;

    constructor(
        controller: VehicleControllerService,
        router: express.Router,
        middlewareAuth: AuthMiddleware
    ) {
        this.controller = controller;
        this.router = router;
        this.middlewareAuth = middlewareAuth;
    }

    initRoutes() {
        try {
            // Public routes (accessible by all authenticated users)
            this.router.get("/vehicles", this.middlewareAuth.authenticate, (req, res) => this.controller.getAll(req, res));

            this.router.get("/vehicles/:id", this.middlewareAuth.authenticate, (req, res) => this.controller.getById(req, res));

            this.router.get("/vehicles/brand/:brand", this.middlewareAuth.authenticate, (req, res) => this.controller.getByBrand(req, res));

            this.router.get("/vehicles/model/:model", this.middlewareAuth.authenticate, (req, res) => this.controller.getByModel(req, res));

            this.router.get("/vehicles/year/:year", this.middlewareAuth.authenticate, (req, res) => this.controller.getByYear(req, res));

            // Admin and Secretary routes
            this.router.post(
                "/vehicles",
                this.middlewareAuth.authenticate,
                checkRole([UserRole.ADMIN, UserRole.SECRETARY]),
                upload.single('image'),
                (req, res) => this.controller.create(req, res)
            );

            this.router.put(
                "/vehicles/:id",
                this.middlewareAuth.authenticate,
                checkRole([UserRole.ADMIN, UserRole.SECRETARY]),
                upload.single('image'),
                (req, res) => this.controller.update(req, res)
            );

            this.router.delete(
                "/vehicles/:id",
                this.middlewareAuth.authenticate,
                checkRole([UserRole.ADMIN]),
                (req, res) => this.controller.delete(req, res)
            );

            return this.router;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}