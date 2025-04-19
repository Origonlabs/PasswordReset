import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Intentar una consulta simple para verificar la conexión y la existencia de las tablas
    const { data: usersData, error: usersError } = await supabase.from("users").select("id").limit(1)

    // Si hay un error específico sobre tabla inexistente, la base de datos está conectada pero no configurada
    if (usersError && usersError.message.includes("does not exist")) {
      console.log("Database connected but tables not configured")
      return NextResponse.json({
        connected: true,
        configured: false,
        error: "Database tables not configured",
      })
    }

    // Si hay otro tipo de error, puede ser un problema de conexión
    if (usersError) {
      console.error("Error checking DB connection:", usersError)
      return NextResponse.json({ connected: false, error: usersError.message })
    }

    // Verificar también la tabla de intentos de restablecimiento
    const { data: attemptsData, error: attemptsError } = await supabase.from("reset_attempts").select("id").limit(1)

    if (attemptsError && attemptsError.message.includes("does not exist")) {
      console.log("Users table exists but reset_attempts table does not")
      return NextResponse.json({
        connected: true,
        configured: false,
        error: "Reset attempts table not configured",
      })
    }

    // Si llegamos aquí, la conexión está bien y ambas tablas existen
    return NextResponse.json({
      connected: true,
      configured: true,
      message: "Database connection successful and tables configured correctly",
    })
  } catch (error) {
    console.error("Unexpected error checking DB connection:", error)
    return NextResponse.json({ connected: false, error: "Unexpected error checking DB connection" })
  }
}
