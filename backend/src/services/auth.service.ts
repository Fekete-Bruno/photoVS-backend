import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "../errors/invalid-credentials-error";
import session_repository from "../repositories/session.repository";
import user_repository from "../repositories/users.repository";

async function signIn(params:SignInParams): Promise<SignInResult> {
    const {email, password} = params;

    const user = await getUserOrFail(email);

    
    await validatePasswordOrFail(password, user.password);
    const token = await createSession(user.id);

    delete user.password;

    return {
        user,
        token
    }
}

async function getUserOrFail(email:string): Promise<GetUserOrFailResult> {
    const user = await user_repository.findByEmail(email, { id: true, email: true, password: true });
    if(!user) throw invalidCredentialsError();

    return user;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) throw invalidCredentialsError();
}

async function createSession(user_id: number) {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET);
    await session_repository.create({
      token,
      user_id,
    });
  
    return token;
  }

export type SignInParams = Pick<users, "email" | "password">;
type SignInResult = {
    user: Pick<users, "id" | "email">
    token: string
};

type GetUserOrFailResult = Pick<users, "id" | "email" | "password">;

const auth_service = {
    signIn,
    createSession
}

export default auth_service;