import { NextResponse } from "next/server"
export const runtime = 'edge'
import { logResetAttempt, checkUserExists } from "@/lib/db"
import { resetAttemptSchema, getClientIP, createRateLimiter, sanitizeString, isOriginAllowed, isContentLengthAllowed, isJsonRequest } from "@/lib/validation"

const limiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5"),
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000")
)

export async function POST(request: Request) {
  try {
    // Origen permitido
    if (!isOriginAllowed(request)) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
    }
    // Content-Type y tamaño
    if (!isJsonRequest(request)) {
      return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 })
    }
    if (!isContentLengthAllowed(request)) {
      return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 })
    }
    // Rate limit por IP
    const ip = getClientIP(request)
    const rl = limiter.check(`${ip}:log-reset`)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intente nuevamente más tarde.", resetTime: rl.resetTime },
        { status: 429, headers: { "X-RateLimit-Limit": (process.env.RATE_LIMIT_MAX_REQUESTS || "5"), "X-RateLimit-Remaining": rl.remaining.toString(), "X-RateLimit-Reset": rl.resetTime.toString() } }
      )
    }

    const body = await request.json()
    const parsed = resetAttemptSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }

    const { username, role, fullName, department, position, accountType, success } = parsed.data

    // Verificación estricta contra la base de datos: los datos deben coincidir tal cual
    const dbCheck = await checkUserExists(username, role)
    if (!dbCheck.exists || !dbCheck.user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 400 })
    }
    const u = dbCheck.user
    if (
      fullName !== u.fullname ||
      (u.department || "") !== (department || "") ||
      (u.position || "") !== (position || "")
    ) {
      return NextResponse.json({ error: "Los datos no coinciden con la base de datos" }, { status: 400 })
    }

    const payload = {
      username: sanitizeString(username),
      role,
      fullName: sanitizeString(fullName),
      department: sanitizeString(department),
      position: sanitizeString(position),
      accountType,
      success: Boolean(success),
      ip,
      userAgent: sanitizeString(request.headers.get('user-agent') || 'unknown'),
    }

    const result = await logResetAttempt(payload)

    if (!result.success) {
      return NextResponse.json({ error: "Error logging reset attempt" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200, headers: { "X-RateLimit-Remaining": rl.remaining.toString() } })
  } catch (error) {
    console.error("Error logging reset attempt:", error)
    return NextResponse.json({ error: "Error logging reset attempt" }, { status: 500 })
  }
}
