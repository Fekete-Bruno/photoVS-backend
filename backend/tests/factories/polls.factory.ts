import { faker } from "@faker-js/faker";
import { users } from "@prisma/client";
import { prisma } from "../../src/config/database";
import { CreatePollParams } from "../../src/services/polls.service";
import { createUser } from "./users-factory";

export const generateValidPollBody = () => ({
    title: faker.lorem.word(),
    description: faker.lorem.words(12),
    img_a_url: faker.image.image(),
    img_b_url: faker.image.image(),
    img_a_title: faker.lorem.word(),
    img_b_title: faker.lorem.word()
});


export async function generateValidPoll(user?:users, params?: Omit<CreatePollParams , "user_id">) {
    const incoming_user = user || (await createUser());
    const incoming_params = params || generateValidPollBody();

    return await prisma.polls.create({
        data:{
            ...incoming_params,
            user_id: incoming_user.id
        }
    });
}