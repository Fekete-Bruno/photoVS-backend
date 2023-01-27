import express, { Express } from "express";
import cors from "cors";
import { connectDb } from "./config/database";

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (_req,res) => res.send("Connection is working!"));

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}
    
export default app;