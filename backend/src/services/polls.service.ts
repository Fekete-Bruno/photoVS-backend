import { polls } from "@prisma/client";
import { inexistentUserError } from "../errors/users-errors";
import poll_repository from "../repositories/polls.repository";
import user_repository from "../repositories/users.repository";

export async function createPoll(params:CreatePollParams): Promise<polls> {
    return poll_repository.create(
        params
    )
}

export type CreatePollParams = Omit< polls, "id" | "created_at" | "updated_at" > ;

const poll_service = {
    createPoll
};

export default poll_service;