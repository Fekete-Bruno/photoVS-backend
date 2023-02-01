import { Router } from "express";
import { postVote } from "../controllers/votes.controller";
import { authenticateToken } from "../middlewares/authentication.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { createVoteSchema } from "../schemas/votes.schema";

const votes_router = Router();

votes_router
    .all("/*", authenticateToken)
    .post("/",validateBody(createVoteSchema),postVote);

export default votes_router;