import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./error.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";

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
    const reqBody: Body = req.body
    let response: ValidResponse | ErrorResponse | CleanedResponse;
    if (reqBody.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
        //response = {error: "Chirp is too long"}
        //res.status(400).send(response);
    } else {
        const words = reqBody.body.split(" ");
        const respArr = words.map((word) => {
            let lower = word.toLowerCase();
            if (lower === "kerfuffle" || lower === "sharbert" || lower === "fornax") {
                return "****";
            }
            return word;
        });
        response = {cleanedBody: respArr.join(" ")};
        const createdChirp = await createChirp({
                body: respArr.join(" "),
                userId: reqBody.userId
            });
        res.status(201).send(createdChirp);
    }
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