import { Router } from "express";
import { deletePoll, getAllPolls, postPoll } from "../controllers/polls.controller";
import { authenticateToken } from "../middlewares/authentication.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { createPollSchema } from "../schemas/polls.schema";

const polls_router = Router();

polls_router
    .all("/*", authenticateToken)
    .post("/",validateBody(createPollSchema),postPoll)
    .delete("/:id",deletePoll)
    .get("/",getAllPolls);

export default polls_router;