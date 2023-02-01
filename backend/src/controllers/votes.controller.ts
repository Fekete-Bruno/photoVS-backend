import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware";
import vote_service, { CreateVoteParams } from "../services/votes.service";

export async function postVote(req:AuthenticatedRequest, res:Response) {
    let params = req.body as Omit<CreateVoteParams, "user_id">;
    let user_id = req.user_id as number;
    
    try {
        const result = await vote_service.createVote({...params,user_id});
        return res.status(httpStatus.CREATED).send(result);
    } catch (error) {
        if(error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}