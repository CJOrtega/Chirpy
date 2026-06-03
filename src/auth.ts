import * as argon2 from "argon2";

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