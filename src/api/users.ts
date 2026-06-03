import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";


export async function handlerUsers(req: Request, res: Response): Promise<void> {
    const user: NewUser = req.body;
    const createdUser = await createUser(user);
    res.header('Content-Type', 'application/json');
    res.status(201).send(createdUser);
}