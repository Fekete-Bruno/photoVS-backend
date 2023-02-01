import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

async function create(data: Prisma.pollsUncheckedCreateInput) {
    return prisma.polls.create({
        data,
    });
}

async function destroy(id:number) {
    return prisma.polls.delete({
        where: {
            id
        }
    });
}

async function findById(id:number) {
    return prisma.polls.findFirst({
        where:{
            id
        }
    });
}

const poll_repository = {
    create,
    destroy,
    findById,
}

export default poll_repository;