import { Request, Response } from "express";
import { UpdateUserToChirpyRed } from "../db/queries/users.js";
import { getApiKey } from "../auth.js";
import { config } from "../config.js";
import { UnauthorizedError } from "./error.js";

type RequestBody = {
    event: string,
    data: {
        userId: string
    }
}
export async function handlerPolka(req: Request, res: Response): Promise<void> {
    const apiKey = getApiKey(req);
    if (apiKey !== config.api.polka) {
        throw new UnauthorizedError("Invalid API Key");
    }
    const requestBody: RequestBody = req.body;
    if (requestBody.event !== "user.upgraded") {
        res.status(204).send()
        return
    }
    const result = await UpdateUserToChirpyRed(requestBody.data.userId);
    if (!result) {
        res.status(404).send();
        return
    }
    res.status(204).send();
}