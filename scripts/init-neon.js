// Simple Neon DB initializer for local/staging setup
// Usage: DATABASE_URL=... node scripts/init-neon.js
// Tries to load DATABASE_URL from .env.local or .env if not provided.

/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { neon } = require('@neondatabase/serverless')

function tryLoadEnvVarFromFile(varName) {
  const candidates = ['.env.local', '.env']
  for (const filename of candidates) {
    const p = path.join(process.cwd(), filename)
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8')
      const line = content.split(/\r?\n/).find((l) => l.trim().startsWith(varName + '='))
      if (line) {
        // naive parser: VAR="value" or VAR=value
        const raw = line.substring(varName.length + 1).trim()
        const val = raw.replace(/^['\"]/,'').replace(/['\"]$/,'')
        if (val) return val
      }
    }
  }
  return null
}

async function main() {
  let dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    dbUrl = tryLoadEnvVarFromFile('DATABASE_URL')
    if (dbUrl) process.env.DATABASE_URL = dbUrl
  }
  if (!dbUrl) {
    console.error('Error: DATABASE_URL is required. Set it in env or .env.local/.env')
    process.exit(1)
  }

  console.log('Connecting to database...')
  const sql = neon(dbUrl)

  try {
    console.log('Ensuring pgcrypto extension...')
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

    console.log('Creating table: users')
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

    console.log('Creating index: idx_users_username_role')
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username_role ON users(username, role)`;

    console.log('Creating table: reset_attempts')
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

    console.log('Creating indexes on reset_attempts')
    await sql`CREATE INDEX IF NOT EXISTS idx_reset_attempts_username ON reset_attempts(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reset_attempts_date ON reset_attempts(attempt_date)`;

    console.log('Database initialized successfully.')
    process.exit(0)
  } catch (err) {
    console.error('Initialization error:', err)
    process.exit(1)
  }
}

main()

