import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import { duplicatedEmailError, duplicatedUsernameError } from "../errors/users-errors";
import user_repository from "../repositories/users.repository";

export async function createUser({email,password,username,avatar_url}:CreateUserParams): Promise<users> {
    await validateUniqueEmail(email);
    await validateUniqueUsername(username);
    const hashPassword = await bcrypt.hash(password,12);
    return user_repository.create({
        email,
        username,
        avatar_url,
        password: hashPassword,
    })

}

async function validateUniqueEmail(email:string) {
    const userWithSameEmail = await user_repository.findByEmail(email);
    if(userWithSameEmail) {
        throw duplicatedEmailError();
    }
}

async function validateUniqueUsername(username:string) {
    const userWithSameUsername = await user_repository.findByUsername(username);
    if(userWithSameUsername) {
        throw duplicatedUsernameError();
    }
}

export type CreateUserParams = Pick<users, |"email" | "password" | "username" | "avatar_url">;

const user_service = {
    createUser,
};

export default user_service;