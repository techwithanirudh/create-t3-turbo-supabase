import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

import { env } from "./client";

const { Pool } = pg;

const runMigrate = async () => {
  if (!env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  // Use the non-pooling URL for direct PostgreSQL connection
  const connectionString = env.POSTGRES_URL.replace(":6543", ":5432");
  console.log("Using connection string:", connectionString);

  // Create a new pool instance with the connection string
  const pool = new Pool({ connectionString });

  try {
    const db = drizzle(pool);

    console.log("⏳ Running migrations...");
    const start = Date.now();

    await migrate(db, { migrationsFolder: "migrations" });

    const end = Date.now();
    console.log(`✅ Migrations completed in ${end - start}ms`);
  } catch (error) {
    console.error("❌ Migration failed");
    console.error(error);

    if (error instanceof Error) {
      if (
        error.message.includes("does not exist") ||
        error.message.includes("permission denied")
      ) {
        console.error("Possible causes:");
        console.error("- Missing database schema or permissions");
        console.error("- Connection to wrong database or environment");
        console.error("- Invalid Postgres URL");
      }

      if (error.message.includes("already exists")) {
        console.error(
          "Table or function already exists - you may need to drop it first",
        );
      }
    }

    process.exit(1);
  } finally {
    // Close the pool when done
    await pool.end();
    process.exit(0);
  }
};

console.log("Starting migration process...");
runMigrate().catch((err) => {
  console.error("❌ Migration failed with an unhandled error");
  console.error(err);
  process.exit(1);
});
