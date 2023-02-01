import { votes } from "@prisma/client";
import { notFoundError } from "../errors/common-errors";
import vote_repository from "../repositories/votes.repository";
import { getPollOrFail } from "./polls.service";

async function createVote(params:CreateVoteParams): Promise<votes> {
    await getPollOrFail(params.poll_id);

    return vote_repository.create(params);
}

export type CreateVoteParams = Omit< votes, "id" >

const vote_service = {
    createVote
};

export default vote_service;