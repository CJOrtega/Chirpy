import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError } from "./error.js";
import { hashPassword } from "../auth.js";

export type UserResponseOmitPassword = Omit<NewUser, "hashedPassword">;
type User = {
    password: string,
    email: string
}

export async function handlerUsers(req: Request, res: Response): Promise<void> {
    const user: User = req.body;
    if (!user.password) {
        throw new BadRequestError("User must set a password");
    }
    const hashedPw = await hashPassword(user.password);
    const createdUser = await createUser({
        email: user.email,
        hashedPassword: hashedPw
    });

    res.header('Content-Type', 'application/json');
    res.status(201).send({
        id: createdUser.id,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
        email: createdUser.email
    } satisfies UserResponseOmitPassword);
}