import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware";
import poll_service, { CreatePollParams } from "../services/polls.service";

export async function postPoll(req:AuthenticatedRequest, res:Response) {
    let params = req.body as Omit<CreatePollParams, "user_id">;
    let user_id = req.user_id as number;

    try {
        const poll = await poll_service.createPoll({...params, user_id});
        return res.status(httpStatus.CREATED).send(poll);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function deletePoll(req:AuthenticatedRequest, res:Response) {
    let poll_id = Number(req.params.id);
    let user_id = req.user_id as number;
    
    try {
        await poll_service.deletePoll(poll_id,user_id);
        return res.sendStatus(httpStatus.OK);
    } catch(error) {
        if(error.name === "InvalidCredentialsError") return res.status(httpStatus.UNAUTHORIZED).send(error);
        
        if(error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}