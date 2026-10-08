import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPool, withBypassRls } from "./client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const pool = createPool();
  const migrationsDir = path.resolve(__dirname, "../migrations");
  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();

  await withBypassRls(pool, async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    for (const file of files) {
      const applied = await client.query(`SELECT 1 FROM schema_migrations WHERE id = $1`, [file]);
      if (applied.rowCount) {
        console.log(`skip ${file}`);
        continue;
      }
      const sql = await readFile(path.join(migrationsDir, file), "utf8");
      console.log(`apply ${file}`);
      await client.query(sql);
      await client.query(`INSERT INTO schema_migrations (id) VALUES ($1)`, [file]);
    }
  });

  await pool.end();
  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
