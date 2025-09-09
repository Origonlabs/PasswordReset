/* eslint-disable no-console */
// Seed initial users into Neon/Postgres
// Usage: DATABASE_URL=... node scripts/seed-neon.js

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

const users = [
  { username: 'jperez', role: 'developer', fullname: 'Juan Pérez', department: 'ingenieria', position: 'Desarrollador Senior' },
  { username: 'mrodriguez', role: 'developer', fullname: 'María Rodríguez', department: 'ciberseguridad', position: 'Analista de Seguridad' },
  { username: 'alopez', role: 'executive', fullname: 'Ana López', department: 'ventas', position: 'Gerente de Ventas' },
  { username: 'cgomez', role: 'executive', fullname: 'Carlos Gómez', department: 'finanzas', position: 'Director Financiero' },
  { username: 'admin', role: 'developer', fullname: 'Administrador', department: 'ingenieria', position: 'Administrador de Sistemas' },
  { username: 'test', role: 'executive', fullname: 'Usuario de Prueba', department: 'estrategia', position: 'Analista de Negocio' },
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

  // Ensure tables exist minimally
  try {
    await sql`SELECT 1 FROM users LIMIT 1`;
  } catch (e) {
    console.error('Table users does not exist. Run `npm run db:init` first.')
    process.exit(3)
  }

  let inserted = 0
  for (const u of users) {
    try {
      await sql`INSERT INTO users (username, role, fullname, department, position)
                VALUES (${u.username}, ${u.role}, ${u.fullname}, ${u.department}, ${u.position})
                ON CONFLICT (username) DO UPDATE SET
                  role = EXCLUDED.role,
                  fullname = EXCLUDED.fullname,
                  department = EXCLUDED.department,
                  position = EXCLUDED.position`;
      inserted += 1
      console.log(`Upserted user: ${u.username}`)
    } catch (e) {
      console.error(`Failed to upsert ${u.username}:`, e?.message || e)
    }
  }

  console.log(`Done. Upserted ${inserted} users.`)
}

main()

