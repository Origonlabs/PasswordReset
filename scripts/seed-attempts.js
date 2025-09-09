/* eslint-disable no-console */
// Seed reset_attempts with sample data for testing
// Usage: DATABASE_URL=... node scripts/seed-attempts.js

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

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const attempts = [
  { username: 'jperez', role: 'developer', full_name: 'Juan Pérez', department: 'ingenieria', position: 'Desarrollador Senior', account_type: 'microsoft', ip_address: '203.0.113.10', user_agent: 'Mozilla/5.0', success: true, attempt_date: daysAgo(0) },
  { username: 'mrodriguez', role: 'developer', full_name: 'María Rodríguez', department: 'ciberseguridad', position: 'Analista de Seguridad', account_type: 'google', ip_address: '203.0.113.20', user_agent: 'Mozilla/5.0', success: false, attempt_date: daysAgo(1) },
  { username: 'alopez', role: 'executive', full_name: 'Ana López', department: 'ventas', position: 'Gerente de Ventas', account_type: 'microsoft', ip_address: '203.0.113.30', user_agent: 'Mozilla/5.0', success: true, attempt_date: daysAgo(2) },
  { username: 'cgomez', role: 'executive', full_name: 'Carlos Gómez', department: 'finanzas', position: 'Director Financiero', account_type: 'google', ip_address: '203.0.113.40', user_agent: 'Mozilla/5.0', success: false, attempt_date: daysAgo(3) },
  { username: 'admin', role: 'developer', full_name: 'Administrador', department: 'ingenieria', position: 'Administrador de Sistemas', account_type: 'microsoft', ip_address: '203.0.113.50', user_agent: 'Mozilla/5.0', success: true, attempt_date: daysAgo(4) },
  { username: 'test', role: 'executive', full_name: 'Usuario de Prueba', department: 'estrategia', position: 'Analista de Negocio', account_type: 'google', ip_address: '203.0.113.60', user_agent: 'Mozilla/5.0', success: true, attempt_date: daysAgo(5) },
]

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

  const sql = neon(dbUrl)

  // Ensure table exists
  try {
    await sql`SELECT 1 FROM reset_attempts LIMIT 1`;
  } catch (e) {
    console.error('Table reset_attempts does not exist. Run `npm run db:init` first.')
    process.exit(3)
  }

  let inserted = 0
  for (const a of attempts) {
    try {
      await sql`INSERT INTO reset_attempts (username, role, full_name, department, position, account_type, ip_address, user_agent, success, attempt_date)
                VALUES (${a.username}, ${a.role}, ${a.full_name}, ${a.department}, ${a.position}, ${a.account_type}, ${a.ip_address}, ${a.user_agent}, ${a.success}, ${a.attempt_date})`;
      inserted += 1
      console.log(`Inserted attempt for: ${a.username}`)
    } catch (e) {
      console.error(`Failed to insert attempt for ${a.username}:`, e?.message || e)
    }
  }

  console.log(`Done. Inserted ${inserted} attempts.`)
}

main()

