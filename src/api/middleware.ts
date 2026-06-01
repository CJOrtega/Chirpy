import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";


export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        const code = res.statusCode;
        if (code >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`);
        }
    });
    next();
};

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction): void {
    config.fileServerHits += 1;
    next();
};