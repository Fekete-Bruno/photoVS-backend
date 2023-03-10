import { faker } from "@faker-js/faker";
import { prisma } from "../src/config/database";

export async function cleanDb() {
    await prisma.votes.deleteMany();
    await prisma.polls.deleteMany();
    await prisma.sessions.deleteMany();
    await prisma.users.deleteMany();
}

export function generateValidUser() {
    return({
        email: faker.internet.email(),
        password: faker.internet.password(6),
        username: faker.internet.userName(),
        avatar_url: faker.internet.avatar(),
    });
}