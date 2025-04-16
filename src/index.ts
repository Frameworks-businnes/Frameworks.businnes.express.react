import express, { json } from "express";
import { Enviroments } from './plugins/Enviroments.service';
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";


import { UserControllerService } from "./controllers/User.controller.service";
import { AuthControllerService } from "./controllers/Auth.controller.service";

import { UserRepository } from './repositories/User.repository';

import { UserRoutes } from "./routes/User.routes";
import { AuthRoutes } from "./routes/Auth.routes";
import { AuthMiddleware } from "./middlewares/Auth.middleware";

class Server {
    private server: express.Application;
    private port: typeof Enviroments.PORT;

    constructor(
        server: express.Application, 
        port: typeof Enviroments.PORT
    ) {
        this.server = server;
        this.port = port;
    }

    initServer() {
        try {

            this.server.use(json());
            this.server.use(cors({
                origin: 'http://localhost:5173', 
                credentials: true
            }));
            this.server.use(morgan("dev"));
            this.server.use(cookieParser());

            const userRepository = new UserRepository();
            const authMiddleware = new AuthMiddleware(userRepository);
            
            const userController = new UserControllerService(userRepository);
            const authController = new AuthControllerService(userRepository);
            
            const userRoutes = new UserRoutes(userController, express.Router(), authMiddleware);
            const authRoutes = new AuthRoutes(authController, express.Router());

            this.server.use("/api", userRoutes.initRoutes());
            this.server.use("/api/auth", authRoutes.initRoutes());
            
            this.server.listen(this.port, () => {
                console.log(`Server running at http://localhost:${this.port}`);
            });
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}

const server = new Server(express(), Enviroments.PORT);
server.initServer();