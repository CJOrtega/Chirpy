import { Request, Response } from "express";
import { config } from "../config.js";


export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.api.fileServerHits = 0;
    res.status(200).send();
}