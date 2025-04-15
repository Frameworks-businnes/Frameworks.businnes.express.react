import express, { json } from "express";
import { Enviroments } from './plugins/Enviroments.service';
import cors from "cors"
import morgan from "morgan";
import { UserRoutes } from "./routes/User.routes";
import { UserControllerService } from "./controllers/User.controller.service";
import {  UserRepository } from './repositories/User.repository';


class Server {

    private server : express.Application
    private port   : typeof Enviroments.PORT

    constructor(
        server : express.Application, 
        port   : typeof Enviroments.PORT
    ) {

        this.server = server,
        this.port   = port
        
    }

    initServer(){

        try {

            this.server.use(json())
            this.server.use(cors())
            this.server.use(morgan("dev"))

            const userRepository = new UserRepository()
            const userController = new UserControllerService(userRepository)
            const userRoutes = new UserRoutes(userController, express.Router())

            this.server.use("/api", userRoutes.initRoutes())
            
            this.server.listen(this.port, () => {
                console.log(`running server in http://localhost:${this.port}`);
                
            })

        } catch (error) {
            throw new Error(`${error}`);
            
        }
    }


}


const server = new Server(express(), Enviroments.PORT)

server.initServer()