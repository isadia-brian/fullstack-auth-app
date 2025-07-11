import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import * as t from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const userRoles = ["user", "supervisor", "administrator"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = t.text("roles", { enum: userRoles });

// Helpers
const timestamps = {
  updated_at: t
    .integer("updated_at", { mode: "timestamp" })
    .$onUpdateFn(() => new Date()),
  created_at: t
    .integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};

export const users = table(
  "users",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: t.text().notNull(),
    email: t.text().notNull().unique(),
    password: t.text().notNull(),
    role: userRoleEnum.default("user").notNull(),
    ...timestamps,
  },
  (table) => ({
    emailIdx: t.uniqueIndex("email_idx").on(table.email),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
