import { Request, Response } from "express";
import { BadRequestError } from "./error.js";

type Body = {
    "body": string
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
        res.send(response);
    } 
}