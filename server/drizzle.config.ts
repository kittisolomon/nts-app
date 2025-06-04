import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
} satisfies Config; 