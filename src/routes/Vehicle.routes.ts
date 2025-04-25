import { VehicleControllerService } from "../controllers/Vehicle.controller.service";
import * as express from "express";
//import express, { Request, Response } from 'express';

export class VehicleRoutes {
    private controller: VehicleControllerService;
    private router: express.Router;

    constructor(
        controller: VehicleControllerService,
        router: express.Router
    ){
        this.controller = controller;
        this.router = router;
    }

    initRoutes(){
        try {
            // Public routes
            this.router.post("/vehicles", (req, res) => this.controller.create(req, res));
            
            // Protected routes
            this.router.get("/vehicles", (req, res) => this.controller.getAll(req, res));
            this.router.get("/vehicles/:id", (req, res) => this.controller.getById(req, res));
            this.router.put("/vehicles/:id", (req, res) => this.controller.update(req, res));
            this.router.delete("/vehicles/:id", (req, res) => this.controller.delete(req, res));

            return this.router;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}