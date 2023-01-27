import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { users } from "@prisma/client";
import { prisma } from "../../src/config/database";

export async function createUser(params: Partial<users> = {}): Promise<users> {
    const incoming_password = params.password || faker.internet.password(7);
    const hashPassword = await bcrypt.hash(incoming_password, 10);

    return prisma.users.create({
        data:{
            username:params.username || faker.internet.userName(),
            email:params.email || faker.internet.email(),
            password: hashPassword,
            avatar_url: params.avatar_url || faker.internet.avatar()
        }
    })
}