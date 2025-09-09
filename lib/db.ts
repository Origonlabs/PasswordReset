import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Neon connection will fail without it.')
}

export const sql = neon(process.env.DATABASE_URL || '')

export async function checkUserExists(username: string, role: string) {
  try {
    const rows = await sql<{
      username: string
      role: string
      fullname: string
      department: string | null
      position: string | null
    }[]>`SELECT username, role, fullname, department, position FROM users WHERE username = ${username} AND role = ${role} LIMIT 1`

    const user = rows[0]
    return { exists: !!user, user: user || null }
  } catch (error) {
    console.error('Neon checkUserExists error:', error)
    return { exists: false, user: null, error: 'DB error' }
  }
}

export async function logResetAttempt(userData: {
  username: string
  role: string
  fullName: string
  department: string
  position: string
  accountType: string
  ip?: string
  userAgent?: string
  success: boolean
}) {
  try {
    await sql`INSERT INTO reset_attempts (username, role, full_name, department, position, account_type, ip_address, user_agent, success, attempt_date)
              VALUES (${userData.username}, ${userData.role}, ${userData.fullName}, ${userData.department}, ${userData.position}, ${userData.accountType}, ${userData.ip || ''}, ${userData.userAgent || ''}, ${userData.success}, NOW())`
    return { success: true }
  } catch (error) {
    console.error('Neon logResetAttempt error:', error)
    return { success: false, error: 'DB error' }
  }
}

