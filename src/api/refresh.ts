import { Request, Response } from "express";
import { getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { createRefreshToken, getRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./error.js";
import { getUserFromRefreshToken } from "../db/queries/users.js";
import { config } from "../config.js";



export async function handlerRefresh(req: Request, res: Response): Promise<void> {
    const refreshToken = getBearerToken(req);
    const result = await getUserFromRefreshToken(refreshToken);
    if (!result) {
        throw new UnauthorizedError("Refresh token not in database");
    }
    const newJWTToken = makeJWT(result.user.id, config.jwt.defaultDuration, config.jwt.secret);
    res.send({
        token: newJWTToken
    });
}