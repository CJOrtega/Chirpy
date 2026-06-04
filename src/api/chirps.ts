import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./error.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type Body = {
    "body": string,
    "userId": string
};

type ValidResponse = {
    "valid": boolean;
}

type ErrorResponse = {
    "error": string;
}

type CleanedResponse = {
    cleanedBody: string;
}

export async function handlerChirpValidate(req: Request, res: Response): Promise<void> {
    const reqBody: Body = req.body;
    const token = getBearerToken(req);
    const jwtUserId = validateJWT(token, config.jwtSecret);
    if (reqBody.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
        //response = {error: "Chirp is too long"}
        //res.status(400).send(response);
    } 
    const words = reqBody.body.split(" ");
    const respArr = words.map((word) => {
        let lower = word.toLowerCase();
        if (lower === "kerfuffle" || lower === "sharbert" || lower === "fornax") {
            return "****";
        }
        return word;
    });
    const createdChirp = await createChirp({
            body: respArr.join(" "),
            userId: jwtUserId
        });
    res.status(201).send(createdChirp);
}

export async function handlerGetAllChirps(_: Request, res: Response): Promise<void> {
    const allChirps = await getAllChirps();
    res.status(200).send(allChirps);
}

export async function handlerGetChirp(req: Request, res: Response): Promise<void> {
    const { chirpId } = req.params;
    if (typeof chirpId !== "string") {
        throw new BadRequestError("request parameter is not a string");
    }
    const chirpDB = await getChirp(chirpId);
    if (!chirpDB) {
        throw new NotFoundError(`Chirp with id ${chirpId} was not found in database`);
    }
    res.send(chirpDB);
}