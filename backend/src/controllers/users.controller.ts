import user_service from "../services/users.service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postUser(req:Request, res:Response) {
    let { email, password, username, avatar_url } = req.body;
    if(!avatar_url){
        avatar_url = '';
    }

    try {
        const user = await user_service.createUser({email,password,username,avatar_url});

        return res.status(httpStatus.CREATED).json({
            id: user.id,
            email: user.email
        })
    } catch (error) {
        if (error.name === "DuplicatedEmailError" || error.name === "DuplicatedUsernameError") {
            return res.status(httpStatus.CONFLICT).send(error);
        }
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}