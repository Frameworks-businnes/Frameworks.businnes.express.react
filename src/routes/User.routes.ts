import { UserControllerService } from "../controllers/User.controller.service";
import express, { Request, Response } from 'express';



export class UserRoutes {

    private controller : UserControllerService
    private router : express.Router
    

    constructor(
        controller : UserControllerService,
        router : express.Router
    ){
        this.controller = controller;
        this.router = router
    }

    initRoutes(){

        try {
            

            this.router.post("/users",(req:Request, res:Response) => this.controller.create(req, res))


            return this.router

        } catch (error) {
            throw new Error(`${error}`);
            
        }
    }

}