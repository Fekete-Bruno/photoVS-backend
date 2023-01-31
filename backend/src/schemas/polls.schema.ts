import Joi from "joi"
import { CreatePollParams } from "../services/polls.service"

export const createPollSchema = Joi.object<CreatePollParams>({
    title: Joi.string().max(64).required(),
    description: Joi.string().max(255).required(),
    img_a_url: Joi.string().uri().max(255).required(),
    img_b_url: Joi.string().uri().max(255).required(),
    img_a_title: Joi.string().max(255).required(),
    img_b_title: Joi.string().max(255).required(),
})