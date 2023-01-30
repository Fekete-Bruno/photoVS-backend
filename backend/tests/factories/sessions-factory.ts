import { sessions, users } from "@prisma/client";
import { prisma } from "../../src/config/database";
import { createUser } from "./users-factory";
import * as jwt from "jsonwebtoken";

export async function generateValidToken(user?: users) {
    const incoming_user = user || (await createUser());
    const token = jwt.sign({user_id: incoming_user.id}, process.env.JWT_SECRET);

    await prisma.sessions.create({
        data: {
            token: token,
            user_id: incoming_user.id,
        }
    });

    return token;
}