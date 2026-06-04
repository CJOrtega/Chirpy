import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, refreshTokens, users } from "../schema.js";
import { UnauthorizedError } from "../../api/error.js";


export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function deleteAllUsers() {
    const deletedUsers = await db.delete(users).returning();
    return deletedUsers;
}

export async function getUserByEmail(email: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result;
}

export async function getUserFromRefreshToken(refreshTokenString: string) {
    const [user] = await db
        .select({user: users})
        .from(users)
        .innerJoin(refreshTokens, eq(refreshTokens.userId, users.id))
        .where(and(
            eq(refreshTokens.token, refreshTokenString),
            gt(refreshTokens.expiresAt, new Date()), 
            isNull(refreshTokens.revokedAt)
        ))
        .limit(1);
    return user;
}