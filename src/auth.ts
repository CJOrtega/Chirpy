import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequestError, ForbiddenError } from "./api/error.js";

export async function hashPassword(password: string): Promise<string> {
    let hash;
    try {
        hash = await argon2.hash(password);
    } catch(err) {
        console.log(err);
    }

    if (!hash) {
        throw new Error;
    }
    return hash;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, password);
            
    } catch(err) {
        return false;
    }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const timeNow = Math.floor(Date.now() / 1000);
    const token = jwt.sign({
        iss: "chirpy",
        sub: userID,
        iat: timeNow,
        exp: timeNow + expiresIn
    } satisfies payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const jwtInfo = jwt.verify(tokenString, secret);
        if (typeof jwtInfo === "string") {
            throw new BadRequestError("Invalid JWT");
        }
        if (typeof jwtInfo.sub !== "string") {
            throw new BadRequestError("Invalid JWT");
        }
        return jwtInfo.sub;
    } catch(err) {
        throw new BadRequestError("Invalid JWT");
    }
}