import { Request, Response } from "express";
import { createUser, getUserFromRefreshToken, updateUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";

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
type UpdateUserRequest = {
    password: string,
    email: string
}

export async function handlerUpdateUser(req: Request, res: Response): Promise<void> {

    const token = getBearerToken(req);
    const fieldsToUpdate: UpdateUserRequest = req.body;
    console.log(fieldsToUpdate)
    if (!fieldsToUpdate.email || !fieldsToUpdate.password) {
        throw new BadRequestError("Missing email or password in the request");
    }
    const hashedPw = await hashPassword(fieldsToUpdate.password);
    const userID = validateJWT(token, config.jwt.secret);
    const updatedUser = await updateUser(userID, fieldsToUpdate.email, hashedPw);
    res.send({
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    } satisfies UserResponseOmitPassword)
}