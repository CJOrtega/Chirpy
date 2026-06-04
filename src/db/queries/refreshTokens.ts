import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(userID: string, tokenString: string) {
    const now = new Date();
    const [refreshToken] = await db
        .insert(refreshTokens)
        .values({
            userId: userID,
            token: tokenString,
            expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
        } satisfies NewRefreshToken)
        .returning();
    return refreshToken;
}

export async function getRefreshToken(refreshTokenString: string) {
    const [refreshToken] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshTokenString));
    return refreshToken;
}

export async function revokeRefreshToken(refreshTokenString: string) {
    const [result] = await db
        .update(refreshTokens)
        .set({revokedAt: new Date()})
        .where(eq(refreshTokens.token, refreshTokenString))
        .returning();
    return result;
}