/* eslint-disable no-console */
// Connectivity and schema check for Neon/Postgres
// Usage: DATABASE_URL=... node scripts/check-neon.js

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
    console.error('DATABASE_URL is not set. Define it in env or .env.local/.env')
    process.exit(2)
  }

  console.log('Checking connection to database...')
  const sql = neon(dbUrl)

  try {
    await sql`SELECT 1`;
  } catch (e) {
    console.error('Connection failed:', e?.message || e)
    process.exit(1)
  }

  let usersOk = false
  let attemptsOk = false
  try {
    await sql`SELECT id FROM users LIMIT 1`;
    usersOk = true
  } catch (e) {
    const msg = String(e?.message || e)
    if (/does not exist|relation .* does not exist/i.test(msg)) {
      console.warn('Table missing: users')
    } else {
      console.error('Users table check error:', msg)
    }
  }

  try {
    await sql`SELECT id FROM reset_attempts LIMIT 1`;
    attemptsOk = true
  } catch (e) {
    const msg = String(e?.message || e)
    if (/does not exist|relation .* does not exist/i.test(msg)) {
      console.warn('Table missing: reset_attempts')
    } else {
      console.error('reset_attempts table check error:', msg)
    }
  }

  if (usersOk && attemptsOk) {
    console.log('OK: connected and schema configured.')
    process.exit(0)
  } else {
    console.log('Connected but schema not fully configured.')
    process.exit(3)
  }
}

main()

