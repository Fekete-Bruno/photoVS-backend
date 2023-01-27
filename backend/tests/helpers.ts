import { prisma } from "../src/config/database";

export async function cleanDb() {
    await prisma.votes.deleteMany();
    await prisma.polls.deleteMany();
    await prisma.sessions.deleteMany();
    await prisma.users.deleteMany();
}