import { pgTable, uuid } from "drizzle-orm/pg-core";

// Reference to Supabase's auth.users table
export const Users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
  },
  (_table) => {
    return {
      tableName: "users",
      schema: "auth",
    };
  },
);

// Used to setup foreign key from profile.id to auth.users table in Supabase
