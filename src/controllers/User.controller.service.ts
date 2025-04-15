import { Request, Response } from "express";
import { UserRepository } from "../repositories/User.repository";


export class UserControllerService {
    private repository : UserRepository
    constructor(
        repository : UserRepository
    ) {
        this.repository = repository
    }

    async create(req: Request, res : Response):Promise<void>{
        
        const {name , email, password} = req.body



        try {
        
            const user = await this.repository.create({name , email, password})

            res.status(201).json({
                msj :"user created",
                data : user
            })
            


        } catch (error) {
            res.status(500).json({
                msj : "server error",
                error : error
            })
        }

    }
}