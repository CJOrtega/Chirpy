import { Request, Response } from "express";
import { config } from "../config.js";


export async function handlerHits(req: Request, res: Response): Promise<void> {
    res.set('Content-Type', 'text/plain');
    res.send(`Hits: ${config.fileServerHits}`);
}