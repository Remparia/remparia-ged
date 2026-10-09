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
  cookieAdminToken: process.env.COOKIE_ADMIN_TOKEN ?? "",
  cookieIpSalt: process.env.COOKIE_IP_SALT ?? "rempatia-cookie-salt",
  mailTo: process.env.MAIL_TO ?? "contact@remparia.com",
  mailFrom: process.env.MAIL_FROM ?? "Remparia GED <noreply@remparia.com>",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  koalendarUrl:
    process.env.KOALENDAR_URL ?? "https://koalendar.com/e/rencontrer-contact-remparia",
};
