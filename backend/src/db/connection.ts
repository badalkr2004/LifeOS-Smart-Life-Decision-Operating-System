import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create the connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM with the connection pool and the unified schema
export const db = drizzle(pool, { schema });
