import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

async function create(data: Prisma.pollsUncheckedCreateInput) {
    return prisma.polls.create({
        data,
    });
}

const poll_repository = {
    create
}

export default poll_repository;