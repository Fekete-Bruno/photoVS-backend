import { CreateUserParams } from "../services/users.service";
import Joi from "joi";

export const createUserSchema = Joi.object<CreateUserParams>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().min(3).required(),
    avatar_url: Joi.string().uri().allow('')
});