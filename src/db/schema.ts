import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),
    email: varchar("email", {length: 256}).unique().notNull()
});

export type NewUser = typeof users.$inferInsert;