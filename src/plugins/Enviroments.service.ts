import "dotenv/config"
import envs from "env-var"

export const Enviroments = {

    PORT : envs.get("PORT").required().asPortNumber()

}