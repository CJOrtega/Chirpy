import { Request, Response } from "express";
import { getBearerToken } from "../auth.js";
import { revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { BadRequestError } from "./error.js";


export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const result = await revokeRefreshToken(refreshToken);
    if (!result) {
        throw new BadRequestError("Could not find token in database");
    }
    res.status(204).send();
}