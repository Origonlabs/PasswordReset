import { NextResponse } from "next/server"
import { checkUserExists } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { username, role } = await request.json()

    if (!username || !role) {
      return NextResponse.json({ error: "Username and role are required" }, { status: 400 })
    }

    const { exists, user } = await checkUserExists(username, role)

    if (!exists) {
      return NextResponse.json({ exists: false }, { status: 200 })
    }

    // Devolver datos del usuario (excepto información sensible)
    return NextResponse.json(
      {
        exists: true,
        user: {
          username: user.username,
          role: user.role,
          fullname: user.fullname,
          department: user.department,
          position: user.position,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error verifying user:", error)
    return NextResponse.json({ error: "Error verifying user" }, { status: 500 })
  }
}
