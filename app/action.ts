// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getDbConnection() {
  const sql = neon(process.env.DATABASE_URL || "");
  return sql;
}
