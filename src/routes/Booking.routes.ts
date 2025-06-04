import { BookingControllerService } from "../controllers/Booking.controller.service";
import * as express from "express";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
//import express, { Request, Response } from 'express';

export class BookingRoutes {
    private controller: BookingControllerService;
    private router: express.Router;
    private middlewareAuth : AuthMiddleware;

    constructor(
        controller: BookingControllerService,
        router: express.Router,
        middlewareAuth : AuthMiddleware
    ){
        this.controller = controller;
        this.router = router;
        this.middlewareAuth = middlewareAuth
    }

    initRoutes(){
        try {
            // Public routes
            this.router.post("/bookings", this.middlewareAuth.authenticate , (req, res) => this.controller.create(req, res));
            
            // Protected routes
            this.router.get("/bookings", this.middlewareAuth.authenticate, (req, res) => this.controller.getAll(req, res));
            this.router.get("/bookings/:id", this.middlewareAuth.authenticate ,(req, res) => this.controller.getById(req, res));
            this.router.put("/bookings/:id", this.middlewareAuth.authenticate,(req, res) => this.controller.update(req, res));
            this.router.delete("/bookings/:id", this.middlewareAuth.authenticate ,(req, res) => this.controller.delete(req, res));

            // New route to convert a booking to a rental
            this.router.post("/bookings/:id/convert-to-rental", this.middlewareAuth.authenticate, (req, res) => this.controller.convertToRental(req, res));

            // New route to cancel a booking
            this.router.put("/bookings/:id/cancel", this.middlewareAuth.authenticate, (req, res) => this.controller.cancelBooking(req, res));

            // New route to generate rental PDF
            this.router.get("/bookings/:id/generate-rental-pdf", this.middlewareAuth.authenticate, (req, res) => this.controller.generateRentalPdf(req, res));

            return this.router;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}