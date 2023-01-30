import express, { Express } from "express";
import cors from "cors";
import { users_router } from "./routers/users.router";
import { loadEnv } from "./config/envs";
import { connectDb } from "./config/database";
import auth_router from "./routers/auth.router";

loadEnv();

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (_req,res) => res.send("Connection is working!"))
    .use("/users",users_router)
    .use("/auth",auth_router);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}
    
export default app;