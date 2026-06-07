import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp, users } from "../schema.js";


export async function createChirp(chirp: NewChirp) {
    const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();

    return result;
}

export async function getAllChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));

    return result;
}

export async function getChirp(chirpId: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    
    return result;
}

export async function deleteChirp(chirpId: string) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result;
}

export async function getChirpsByUserId(userId: string) {
    const result = await db
        .select({
            body: chirps.body,
            createdAt: chirps.createdAt
        }).from(chirps)
        .innerJoin(users, eq(users.id, chirps.userId))
        .where(eq(users.id, userId));
    return result;
}