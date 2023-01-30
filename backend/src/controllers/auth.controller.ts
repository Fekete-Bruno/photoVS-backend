import { Request, Response } from "express";
import httpStatus from "http-status";
import auth_service, { SignInParams } from "../services/auth.service";

export async function postSignIn(req: Request, res: Response) {
    const {email, password} = req.body as SignInParams;
    
    try {
        const result = await auth_service.signIn({ email, password });
        return res.status(httpStatus.OK).send(result);
    } catch (error) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}