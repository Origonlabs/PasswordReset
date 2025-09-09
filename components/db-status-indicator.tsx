"use client"

import { Database, AlertTriangle, Code, Download, ExternalLink } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DbStatusIndicatorProps {
  status: "connected" | "not_configured" | "error" | null
  onSetupDb?: () => void
}

export function DbStatusIndicator({ status, onSetupDb }: DbStatusIndicatorProps) {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [showSql, setShowSql] = useState(false)
  const [setupFailed, setSetupFailed] = useState(false)

  if (!status) return null

  const handleSetupDb = async () => {
    if (onSetupDb) {
      setIsSettingUp(true)
      try {
        const success = await onSetupDb()
        if (!success) {
          setSetupFailed(true)
          // Mostrar automáticamente el SQL cuando falla la configuración
          setShowSql(true)
        }
      } catch (error) {
        console.error("Error setting up database:", error)
        setSetupFailed(true)
        // Mostrar automáticamente el SQL cuando falla la configuración
        setShowSql(true)
      } finally {
        setIsSettingUp(false)
      }
    }
  }

  const sqlScript = `
-- Init schema for Opendex Password Reset (Neon)
-- Requires pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  fullname TEXT NOT NULL,
  department TEXT,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username_role ON users(username, role);

-- Optional seed data
INSERT INTO users (username, role, fullname, department, position)
VALUES 
  ('jperez', 'developer', 'Juan Pérez', 'ingenieria', 'Desarrollador Senior'),
  ('mrodriguez', 'developer', 'María Rodríguez', 'ciberseguridad', 'Analista de Seguridad'),
  ('alopez', 'executive', 'Ana López', 'ventas', 'Gerente de Ventas'),
  ('cgomez', 'executive', 'Carlos Gómez', 'finanzas', 'Director Financiero'),
  ('admin', 'developer', 'Administrador', 'ingenieria', 'Administrador de Sistemas'),
  ('test', 'executive', 'Usuario de Prueba', 'estrategia', 'Analista de Negocio')
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS reset_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  role TEXT NOT NULL,
  full_name TEXT,
  department TEXT,
  position TEXT,
  account_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  attempt_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reset_attempts_username ON reset_attempts(username);
CREATE INDEX IF NOT EXISTS idx_reset_attempts_date ON reset_attempts(attempt_date);
  `.trim()

  const downloadSqlScript = () => {
    const element = document.createElement("a")
    const file = new Blob([sqlScript], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "opendex_setup.sql"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div
      className={`mb-4 px-4 py-3 rounded-md flex items-start text-sm ${
        status === "connected"
          ? "bg-green-50 text-green-700"
          : status === "not_configured"
            ? "bg-amber-50 text-amber-700"
            : "bg-red-50 text-red-700"
      }`}
    >
      {status === "connected" ? (
        <>
          <Database className="h-4 w-4 mr-2 mt-0.5" />
          <div>
            <span className="font-medium">Conectado a la base de datos</span>
            <p className="text-xs mt-1">Las tablas están correctamente configuradas y listas para usar.</p>
          </div>
        </>
      ) : status === "not_configured" ? (
        <>
          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <span className="font-medium">Base de datos no configurada</span>
            <p className="text-xs mt-1">Las tablas necesarias no existen en la base de datos.</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {onSetupDb && !setupFailed && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
                  onClick={handleSetupDb}
                  disabled={isSettingUp}
                >
                  {isSettingUp ? "Verificando..." : "Intentar configuración automática"}
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
                onClick={() => setShowSql(!showSql)}
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                {showSql ? "Ocultar SQL" : "Ver SQL para configuración manual"}
              </Button>

              {showSql && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
                  onClick={downloadSqlScript}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Descargar SQL
                </Button>
              )}
            </div>

            {setupFailed && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-800 font-medium">
                  La configuración automática no está disponible en este entorno de Supabase.
                </p>
                <p className="text-xs mt-1 text-amber-800">
                  Por favor, utilice el script SQL para configurar manualmente la base de datos.
                </p>
              </div>
            )}

            {showSql && (
              <div className="mt-2">
                <div className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{sqlScript}</pre>
                </div>

                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="text-xs font-semibold text-blue-800 flex items-center">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Instrucciones para configurar la base de datos (Neon):
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1 mt-1 text-xs text-blue-800">
                    <li>Acceda al panel de Neon y abra el SQL Editor</li>
                    <li>Cree un nuevo query</li>
                    <li>Pegue el código SQL anterior o use el archivo `sql/init_neon.sql`</li>
                    <li>Ejecute el script</li>
                    <li>Vuelva a esta página y recargue para verificar la conexión</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Error de conexión</span>
            <p className="text-xs mt-1">
              Usando modo de respaldo local. Algunas funciones pueden estar limitadas.{" "}
              <button className="underline font-medium" onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
