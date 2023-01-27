import { Router } from "express";

import { createUserSchema } from "../schemas/users.schemas";
import { validateBody } from "../middlewares/validation.middleware";
import { postUser } from "../controllers/users.controller";

const users_router = Router();

users_router.post("/",validateBody(createUserSchema),postUser);

export { users_router };