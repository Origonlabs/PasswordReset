import { createClient } from "@supabase/supabase-js"

// Estas variables de entorno deben configurarse en tu proyecto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is missing. Make sure you have set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  )
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para verificar si un usuario existe
export async function checkUserExists(username: string, role: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("username, role, fullname, department, position")
      .eq("username", username)
      .eq("role", role)
      .single()

    if (error) {
      // Si el error es "No rows found", significa que el usuario no existe
      if (error.code === "PGRST116") {
        return { exists: false, user: null }
      }

      console.error("Error verificando usuario:", error)
      return { exists: false, user: null, error: error.message }
    }

    return {
      exists: !!data,
      user: data,
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { exists: false, user: null, error: "Error inesperado al verificar usuario" }
  }
}

// Función para registrar un intento de restablecimiento
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
    const { error } = await supabase.from("reset_attempts").insert([
      {
        username: userData.username,
        role: userData.role,
        full_name: userData.fullName,
        department: userData.department,
        position: userData.position,
        account_type: userData.accountType,
        ip_address: userData.ip || "",
        user_agent: userData.userAgent || "",
        success: userData.success,
        attempt_date: new Date(),
      },
    ])

    if (error) {
      console.error("Error registrando intento:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { success: false, error: "Error inesperado al registrar intento" }
  }
}

// Función para obtener estadísticas de intentos de restablecimiento
export async function getResetAttemptStats() {
  try {
    // Obtener el total de intentos
    const { count: totalAttempts, error: countError } = await supabase
      .from("reset_attempts")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error obteniendo estadísticas:", countError)
      return { success: false, error: countError.message }
    }

    // Obtener intentos exitosos
    const { count: successfulAttempts, error: successError } = await supabase
      .from("reset_attempts")
      .select("*", { count: "exact", head: true })
      .eq("success", true)

    if (successError) {
      console.error("Error obteniendo estadísticas:", successError)
      return { success: false, error: successError.message }
    }

    // Obtener intentos recientes (últimas 24 horas)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: recentAttempts, error: recentError } = await supabase
      .from("reset_attempts")
      .select("*", { count: "exact", head: true })
      .gte("attempt_date", yesterday.toISOString())

    if (recentError) {
      console.error("Error obteniendo estadísticas:", recentError)
      return { success: false, error: recentError.message }
    }

    return {
      success: true,
      stats: {
        totalAttempts: totalAttempts || 0,
        successfulAttempts: successfulAttempts || 0,
        recentAttempts: recentAttempts || 0,
        successRate: totalAttempts ? (successfulAttempts! / totalAttempts!) * 100 : 0,
      },
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { success: false, error: "Error inesperado al obtener estadísticas" }
  }
}
