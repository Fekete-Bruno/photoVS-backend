import { polls } from "@prisma/client";
import { notFoundError } from "../errors/common-errors";
import { invalidCredentialsError } from "../errors/invalid-credentials-error";
import poll_repository from "../repositories/polls.repository";

async function getAllPolls() {
    return poll_repository.listAll();
}

async function createPoll(params:CreatePollParams): Promise<polls> {
    return poll_repository.create(
        params
    )
}

async function deletePoll(poll_id:number, user_id: number) {
    if(isNaN(poll_id)) throw notFoundError();

    const poll = await getPollOrFail(poll_id);

    if(poll.user_id !== user_id) throw invalidCredentialsError();

    return poll_repository.destroy(poll_id);
}

async function getPollOrFail(id:number) {
    const poll = await poll_repository.findById(id);
    
    if(!poll) throw notFoundError();

    return poll;
}

export type CreatePollParams = Omit< polls, "id" | "created_at" | "updated_at" > ;

const poll_service = {
    createPoll,
    deletePoll,
    getAllPolls,
};

export default poll_service;