import { Request, Response } from "express";
import { config } from "../config.js";


export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.fileServerHits = 0;
    res.status(200).send();
}