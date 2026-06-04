import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/error.js";
import { Request } from "express";
import { randomBytes } from "node:crypto";

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
        throw new UnauthorizedError("Incorrect login credentials")
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
    let jwtInfo: string | JwtPayload;
    try {
        jwtInfo = jwt.verify(tokenString, secret);
    } catch(err) {
        throw new UnauthorizedError("Invalid JWT");
    }

    if (typeof jwtInfo === "string") {
        throw new UnauthorizedError("Invalid JWT");
    }
    if (jwtInfo.iss !== "chirpy") {
        throw new UnauthorizedError("Invalid user");
    }
    if (typeof jwtInfo.sub !== "string") {
        throw new UnauthorizedError("Invalid JWT");
    }
    return jwtInfo.sub;
}

export function getBearerToken(req: Request): string {
    const bearerHeader = req.get("Authorization");
    if (!bearerHeader) {
        throw new UnauthorizedError("Authorization header is missing");
    }
    const [bearer, reqToken] = bearerHeader.trim().split(/\s+/);
    if (bearer !== "Bearer") {
        throw new UnauthorizedError("Header \"Authorization\" is not Bearer");
    }
    if (!reqToken) {
        throw new UnauthorizedError("JWT not in header");
    }
    return reqToken;
}

export function makeRefreshToken(): string {
    const data = randomBytes(32);
    return data.toString("hex")
}