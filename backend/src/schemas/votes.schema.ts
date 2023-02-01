import Joi from "joi"
import { CreateVoteParams } from "../services/votes.service"

export const createVoteSchema = Joi.object<CreateVoteParams>({
    voted_for_a: Joi.boolean().required(),
    poll_id: Joi.number().min(1).required()
});