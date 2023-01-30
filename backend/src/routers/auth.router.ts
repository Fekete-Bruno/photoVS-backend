import { Router } from "express";
import { postSignIn } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { signInSchema } from "../schemas/auth.schema";

const auth_router = Router();

auth_router.post("/sign-in", validateBody(signInSchema), postSignIn);

export default auth_router;