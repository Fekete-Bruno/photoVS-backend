import express from "express";
import cors from "cors";

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (_req,res) => res.send("Connection is working!"));
    
export default app;