import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth.js";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456";
    
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });
    
    
});

describe("JWT Functions", () => {
    const token = makeJWT("abc123", 1, "verySecretString");
    it("should return true for a valid JWT", () => {
        expect(token).toBeDefined();
    });
    it("should return a userID from a JWT", () => {
        const returnedID = validateJWT(token, "verySecretString");
        expect(returnedID).toBe("abc123");
    });
    it("should throw and error for an wrong secret", () => {
    expect(() => validateJWT(token, "1.verySecretString")).toThrowError();
    });
    it("should throw and error for an invalid token", () => {
    expect(() => validateJWT(token + "1", "1.verySecretString")).toThrowError();
    });
    it("should throw an error for an expired token", async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(() => validateJWT(token, "verySecretString")).toThrowError();
    });
})