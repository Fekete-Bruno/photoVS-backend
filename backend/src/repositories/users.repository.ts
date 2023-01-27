import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

async function findByEmail(email:string, select?: Prisma.usersSelect) {
    
    const params: Prisma.usersFindUniqueArgs = {
        where: {
            email,
        },
    };
    
    if(select) {
        params.select = select;
    }

    return prisma.users.findUnique(params);
}

async function findByUsername(username:string, select?: Prisma.usersSelect) {
    const params: Prisma.usersFindUniqueArgs = {
        where: {
            username,
        },
    };

    if(select) {
        params.select = select;
    }

    return prisma.users.findUnique(params);
}

async function create(data: Prisma.usersUncheckedCreateInput) {
    return prisma.users.create({
        data,
    });
}

const user_repository = {
    findByEmail,
    findByUsername,
    create
}

export default user_repository;