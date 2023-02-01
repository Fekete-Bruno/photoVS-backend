import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

async function create(data:Prisma.votesUncheckedCreateInput) {
    return prisma.votes.create({
        data,
    });
}

const vote_repository = {
    create
}

export default vote_repository;