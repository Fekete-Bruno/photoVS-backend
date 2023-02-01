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

async function listAll() {
    return prisma.polls.findMany(
        {
            include:{
                users: {
                    select:{
                        username:true,
                        avatar_url:true
                    }
                },
                votes: true
            },
            orderBy:{
                id:'desc'
            }
        }
    );
}

const poll_repository = {
    create,
    destroy,
    findById,
    listAll,
}

export default poll_repository;