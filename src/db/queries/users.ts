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

export async function updateUser(userID: string, userEmail: string, userPassword: string) {
    const [result] = await db
        .update(users)
        .set({
            email: userEmail,
            hashedPassword: userPassword
        })
        .where(eq(users.id, userID))
        .returning();
    return result;
}

export async function UpdateUserToChirpyRed(userID: string) {
    const [result] = await db
        .update(users)
        .set({
            IsChirpyRed: true
        })
        .where(eq(users.id, userID))
        .returning();
    return result;
}
