import "dotenv/config";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const sqlite = new Database(process.env.DB_FILE_NAME || "test.sqlite");

export const db = drizzle(sqlite, {
  schema,
  logger: process.env.NODE_ENV !== "production", // Enable logging in dev
});
