import "dotenv/config"
import envs from "env-var"

export const Enviroments = {
    PORT: envs.get("PORT").required().asPortNumber(),
    JWT_SECRET: envs.get("JWT_SECRET").required().asString(),
    JWT_EXPIRES_IN: envs.get("JWT_EXPIRES_IN").required().asString()
}