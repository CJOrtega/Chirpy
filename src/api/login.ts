import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { UserResponseOmitPassword } from "./users.js";
import { UnauthorizedError } from "./error.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";

type BodyLogin = {
    email: string,
    password: string
}

type UserResponseWithToken = UserResponseOmitPassword & { token: string, refreshToken: string };

export async function handlerLogin(req: Request, res: Response): Promise<void> {
    const userLogin: BodyLogin = req.body;
    const user = await getUserByEmail(userLogin.email);
    if (!user) {
        throw new UnauthorizedError("Incorrect login credentials");
    }

    if (await checkPasswordHash(userLogin.password, user.hashedPassword)) {
        
        const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
        const refreshTokenString = makeRefreshToken();
        const refreshToken = await createRefreshToken(user.id, refreshTokenString);
        res.send({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token,
            refreshToken: refreshToken.token
        } satisfies UserResponseWithToken);
    } else {
        throw new UnauthorizedError("incorrect email or password");
    }
}