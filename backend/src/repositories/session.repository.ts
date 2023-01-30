import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

async function create(data: Prisma.sessionsUncheckedCreateInput) {
    return prisma.sessions.create({
        data,
    });
}

const session_repository = {
    create
};

export default session_repository;