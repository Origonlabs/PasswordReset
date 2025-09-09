import { z } from "zod"

// Esquema para verificación de usuario (username + role)
export const userLookupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Formato de nombre de usuario inválido"),
  role: z.enum(["developer", "executive"], { errorMap: () => ({ message: "Rol inválido" }) }),
})

// Esquema para registrar intentos de restablecimiento
export const resetAttemptSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Formato de nombre de usuario inválido"),
  role: z.enum(["developer", "executive"], { errorMap: () => ({ message: "Rol inválido" }) }),
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[\p{L}\s.'-]+$/u, "El nombre solo puede contener letras y espacios"),
  department: z.string().trim().min(1, "Seleccione un departamento").max(100),
  position: z.string().trim().min(2, "El puesto es requerido").max(200),
  accountType: z.enum(["microsoft", "google"], {
    errorMap: () => ({ message: "Tipo de cuenta inválido" }),
  }),
  success: z.boolean().optional().default(false),
})

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
}

export function getClientIP(req: Request): string {
  try {
    // En runtime de Next (Node) podemos leer headers directamente
    const xff = req.headers.get("x-forwarded-for")
    const real = req.headers.get("x-real-ip")
    if (xff) return xff.split(",")[0].trim()
    if (real) return real.trim()
  } catch {}
  return "unknown"
}

// Limitador simple en memoria (por proceso)
export function createRateLimiter(maxRequests = 10, windowMs = 60_000) {
  const store = new Map<string, { count: number; reset: number }>()
  return {
    check(id: string) {
      const now = Date.now()
      const rec = store.get(id)
      if (!rec || now > rec.reset) {
        store.set(id, { count: 1, reset: now + windowMs })
        return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs }
      }
      if (rec.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetTime: rec.reset }
      }
      rec.count += 1
      return { allowed: true, remaining: maxRequests - rec.count, resetTime: rec.reset }
    },
  }
}

// Seguridad: orígenes permitidos para peticiones (CSRF/CORS simple)
export function getAllowedOrigins(): string[] {
  const list = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  const appUrl = process.env.APP_URL?.trim()
  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (appUrl) list.push(appUrl)
  // En Vercel, VERCEL_URL es el dominio del despliegue (sin protocolo)
  if (vercelUrl) {
    const url = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`
    list.push(url)
  }
  // Siempre permitir origen nulo para SSR interno (sin Origin)
  return Array.from(new Set(list))
}

export function isOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // SSR / same-origin fetch sin cabecera
  try {
    const allowed = getAllowedOrigins()
    if (allowed.length === 0) return true
    const o = new URL(origin)
    return allowed.some(a => {
      try {
        const u = new URL(a)
        return u.origin === o.origin
      } catch {
        return a === origin
      }
    })
  } catch {
    return false
  }
}

// Seguridad: limitar tamaño de cuerpo
export function isContentLengthAllowed(request: Request, maxBytes = 10 * 1024): boolean {
  const len = request.headers.get('content-length')
  if (!len) return true
  const n = parseInt(len, 10)
  if (Number.isNaN(n)) return true
  return n <= maxBytes
}

export function isJsonRequest(request: Request): boolean {
  const ct = request.headers.get('content-type') || ''
  return ct.includes('application/json')
}
