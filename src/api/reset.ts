import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from "./error.js";


export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.api.fileServerHits = 0;
    if (config.api.platform != "dev") {
        throw new ForbiddenError("Reset is only allowed in dev environment.")
    }
    await deleteAllUsers();
    res.write("Hits reset to 0");
    res.end();
}