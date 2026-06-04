import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),
    email: varchar("email", {length: 256 }).unique().notNull(),
    hashedPassword: varchar("hashed_password")
        .default("unset")
        .notNull()
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
    id: uuid("id").defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),
    body: varchar("body", { length: 140 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade"}).notNull()
});

export type NewChirp = typeof chirps.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
    token: varchar("token", { length: 256 }).primaryKey().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade"}).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at")
});

export type NewRefreshToken = typeof refreshTokens.$inferInsert;