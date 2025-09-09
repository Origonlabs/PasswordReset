import { NextResponse } from "next/server"
export const runtime = 'edge'
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Intento de consulta simple a 'users'
    try {
      await sql`SELECT id FROM users LIMIT 1`
    } catch (e: any) {
      const msg = String(e?.message || e)
      if (/does not exist|not exist|relation .* does not exist/i.test(msg)) {
        return NextResponse.json({ connected: true, configured: false, error: 'Users table not found' }, { status: 200 })
      }
      return NextResponse.json({ connected: false, error: msg }, { status: 200 })
    }

    // Verificar también 'reset_attempts'
    try {
      await sql`SELECT id FROM reset_attempts LIMIT 1`
    } catch (e: any) {
      const msg = String(e?.message || e)
      if (/does not exist|not exist|relation .* does not exist/i.test(msg)) {
        return NextResponse.json({ connected: true, configured: false, error: 'reset_attempts table not found' }, { status: 200 })
      }
      return NextResponse.json({ connected: false, error: msg }, { status: 200 })
    }

    return NextResponse.json({ connected: true, configured: true, message: "OK" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: String(error?.message || error) }, { status: 200 })
  }
}
