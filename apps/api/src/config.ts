import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const config = {
  host: process.env.API_HOST ?? "0.0.0.0",
  port: Number(process.env.API_PORT ?? 8787),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://127.0.0.1:5173",
  databaseUrl:
    process.env.DATABASE_URL ?? "postgresql://rempatia:rempatia@localhost:5432/rempatia",
};
