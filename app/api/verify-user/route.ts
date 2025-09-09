import { NextResponse } from "next/server"
export const runtime = 'edge'
import { checkUserExists } from "@/lib/db"
import { userLookupSchema, createRateLimiter, getClientIP, isOriginAllowed, isContentLengthAllowed, isJsonRequest } from "@/lib/validation"

const limiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10"),
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000")
)

export async function POST(request: Request) {
  try {
    // Rechazar orígenes no permitidos
    if (!isOriginAllowed(request)) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
    }

    // Validar Content-Type y tamaño
    if (!isJsonRequest(request)) {
      return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 })
    }
    if (!isContentLengthAllowed(request)) {
      return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 })
    }
    // Rate limit por IP
    const ip = getClientIP(request)
    const rl = limiter.check(`${ip}:verify-user`)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intente nuevamente más tarde.", resetTime: rl.resetTime },
        { status: 429, headers: { "X-RateLimit-Limit": (process.env.RATE_LIMIT_MAX_REQUESTS || "10"), "X-RateLimit-Remaining": rl.remaining.toString(), "X-RateLimit-Reset": rl.resetTime.toString() } }
      )
    }

    const body = await request.json()
    const parsed = userLookupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos de entrada inválidos",
          details: parsed.error.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      )
    }
    const { username, role } = parsed.data

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
      { status: 200, headers: { "X-RateLimit-Remaining": rl.remaining.toString() } },
    )
  } catch (error) {
    console.error("Error verifying user:", error)
    return NextResponse.json({ error: "Error verifying user" }, { status: 500 })
  }
}
