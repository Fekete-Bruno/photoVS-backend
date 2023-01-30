import Joi from "joi";
import { SignInParams } from "../services/auth.service";

export const signInSchema = Joi.object<SignInParams>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});