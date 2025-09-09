import { NextResponse } from "next/server"
export const runtime = 'edge'
import { sql } from "@/lib/db"

// Simple endpoint to initialize Neon schema in development.
// Protect with ALLOW_DB_INIT=true to avoid accidental execution.

export async function POST() {
  try {
    if (process.env.ALLOW_DB_INIT !== "true") {
      return NextResponse.json({ ok: false, error: "DB init not allowed" }, { status: 403 })
    }

    // Enable extension for gen_random_uuid (Neon supports pgcrypto)
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

    // Users table
    await sql`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      fullname TEXT NOT NULL,
      department TEXT,
      position TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    await sql`CREATE INDEX IF NOT EXISTS idx_users_username_role ON users(username, role)`;

    // Reset attempts table
    await sql`CREATE TABLE IF NOT EXISTS reset_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL,
      role TEXT NOT NULL,
      full_name TEXT,
      department TEXT,
      position TEXT,
      account_type TEXT,
      ip_address TEXT,
      user_agent TEXT,
      success BOOLEAN DEFAULT FALSE,
      attempt_date TIMESTAMPTZ DEFAULT NOW()
    )`;

    await sql`CREATE INDEX IF NOT EXISTS idx_reset_attempts_username ON reset_attempts(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reset_attempts_date ON reset_attempts(attempt_date)`;

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("init-neon error:", error)
    return NextResponse.json({ ok: false, error: String(error?.message || error) }, { status: 500 })
  }
}
