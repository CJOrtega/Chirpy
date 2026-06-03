import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { UserResponseOmitPassword } from "./users.js";
import { UnauthorizedError } from "./error.js";

type BodyLogin = {
    email: string,
    password: string
}

export async function handlerLogin(req: Request, res: Response): Promise<void> {
    const userLogin: BodyLogin = req.body;
    const user = await getUserByEmail(userLogin.email);
    if (!user) {
        throw new UnauthorizedError("incorrect email or password");
    }

    if (await checkPasswordHash(userLogin.password, user.hashedPassword)) {
        res.send({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email
        } satisfies UserResponseOmitPassword);
    } else {
        throw new UnauthorizedError("incorrect email or password");
    }
}