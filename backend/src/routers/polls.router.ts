import { Router } from "express";
import { postPoll } from "../controllers/polls.controller";
import { authenticateToken } from "../middlewares/authentication.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { createPollSchema } from "../schemas/polls.schema";

const polls_router = Router();

polls_router
    .all("/*", authenticateToken)
    .post("/",validateBody(createPollSchema),postPoll);

export default polls_router;