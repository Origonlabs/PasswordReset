import { NextResponse } from "next/server"
import { logResetAttempt } from "@/lib/supabase"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const headersList = headers()

    // Añadir información del cliente
    userData.ip = headersList.get("x-forwarded-for") || "unknown"
    userData.userAgent = headersList.get("user-agent") || "unknown"

    const success = await logResetAttempt(userData)

    if (!success) {
      return NextResponse.json({ error: "Error logging reset attempt" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error logging reset attempt:", error)
    return NextResponse.json({ error: "Error logging reset attempt" }, { status: 500 })
  }
}
