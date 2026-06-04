import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { UserResponseOmitPassword } from "./users.js";
import { UnauthorizedError } from "./error.js";
import { config } from "../config.js";

type BodyLogin = {
    email: string,
    password: string
    expiresInSeconds?: number;
}

type UserResponseWithToken = UserResponseOmitPassword & { token: string };

const hour = 60 * 60;

export async function handlerLogin(req: Request, res: Response): Promise<void> {
    const userLogin: BodyLogin = req.body;
    const user = await getUserByEmail(userLogin.email);
    if (!user) {
        throw new UnauthorizedError("Incorrect login credentials");
    }

    if (await checkPasswordHash(userLogin.password, user.hashedPassword)) {
        let expiresIn = hour;
        if (userLogin.expiresInSeconds !== undefined) {
            if (userLogin.expiresInSeconds < expiresIn && 
                userLogin.expiresInSeconds > 0
            ) {
                expiresIn = userLogin.expiresInSeconds
            }
        } 
        const token = makeJWT(user.id, expiresIn, config.jwtSecret);
        
        res.send({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token
        } satisfies UserResponseWithToken);
    } else {
        throw new UnauthorizedError("incorrect email or password");
    }
}