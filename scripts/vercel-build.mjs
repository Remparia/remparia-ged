import { cpSync, existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";

execSync("pnpm --filter @rempatia/web build", { stdio: "inherit" });

for (const dir of [".next", "public"]) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

cpSync("apps/web/.next", ".next", { recursive: true });
cpSync("apps/web/public", "public", { recursive: true });
