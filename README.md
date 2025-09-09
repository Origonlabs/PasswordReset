# PasswordReset

Aplicación Next.js para gestionar intentos de reseteo de contraseña con verificación de usuario, logging de intentos y base de datos en Neon/Postgres. Incluye APIs para verificación y registro de intentos, middleware de seguridad, y scripts para inicializar y seedear la base de datos.

## Índice
- Introducción
- Stack y Estructura
- Requisitos
- Variables de Entorno
- Configuración de Base de Datos (Neon)
- Scripts Disponibles
- Desarrollo Local
- Endpoints de API
- Middleware y Seguridad
- Flujo de Reseteo
- Resolución de Problemas
- Roadmap breve

## Introducción
Este proyecto provee una UI simple para ingresar un identificador de usuario (por ejemplo email o username), validarlo contra una base de datos en Neon, y registrar cada intento de reseteo. Pensado para integrarse con flujos corporativos (Microsoft/SSO) o como base para un sistema propio.

## Stack y Estructura
- Next.js 14 (App Router)
- TypeScript + Tailwind
- Postgres en Neon (serverless)
- Librería de componentes UI (shadcn/ui)

Estructura relevante:
- `app/` páginas, layout y rutas de API (`app/api/*`)
- `components/` UI y formularios (`password-reset-form.tsx`, `microsoft-reset-form.tsx`, `db-status-indicator.tsx`)
- `lib/` utilidades (`db.ts`, `validation.ts`)
- `scripts/` utilidades Node para Neon (`check-neon.js`, `init-neon.js`, `seed-neon.js`, `seed-attempts.js`)
- `sql/` definiciones SQL (`init_neon.sql`)
- `public/` assets

## Requisitos
- Node.js 18+ (se recomienda 18 LTS o 20 LTS)
- npm o pnpm (el repo incluye `package-lock.json` para npm)
- Cuenta y base de datos en Neon (Postgres)

## Variables de Entorno
Crea tu `.env.local` en base a `.env.example`.

Claves típicas:
- `DATABASE_URL`: cadena de conexión de Neon (formato `postgres://user:pass@host/db?sslmode=require`)
- `NEXT_PUBLIC_APP_NAME`: nombre mostrado en la UI
- Otras claves opcionales para logs o proveedores (según tu integración)

Notas:
- `.env*` está ignorado por git (.gitignore). No subas credenciales.
- Si usas Vercel u otro PaaS, define estas variables en su panel.

## Configuración de Base de Datos (Neon)
1) Crea el proyecto y DB en https://neon.tech
2) Obtén la `DATABASE_URL` con SSL habilitado.
3) Inicializa el esquema:
   - `npm run db:init` (usa `sql/init_neon.sql`)
4) Opcional: poblar datos de prueba
   - `npm run db:seed`
5) Verifica conexión:
   - `npm run db:check`

Los scripts usan la `DATABASE_URL` de tu entorno (`.env.local`).

## Scripts Disponibles
Desde `package.json`:
- `dev`: inicia Next en modo desarrollo
- `build`: compila la app
- `start`: ejecuta producción
- `lint`: corre linter (si está configurado)
- `db:check`: verifica conexión a Neon (`scripts/check-neon.js`)
- `db:init`: aplica el esquema inicial (`sql/init_neon.sql` via `scripts/init-neon.js`)
- `db:seed`: datos base de usuarios/reset attempts (`scripts/seed-neon.js` y/o `scripts/seed-attempts.js`)

Ejemplos:
```
npm install
npm run db:check
npm run db:init
npm run db:seed
npm run dev
```

## Desarrollo Local
1) Instala dependencias: `npm install`
2) Configura `.env.local`
3) Inicializa base de datos (sección Neon)
4) Levanta el entorno: `npm run dev`

La app correrá en `http://localhost:3000`.

## Endpoints de API
Rutas en `app/api/*`:

- `GET /api/check-db-connection`
  - Verifica conectividad a la DB. Útil para health checks y UI de estado (`db-status-indicator`).

- `POST /api/verify-user`
  - Body: `{ identifier: string }` (email/username según tu modelo)
  - Respuesta: detalles mínimos del usuario o estado de validación.
  - Usa validaciones de `lib/validation.ts` y consultas en `lib/db.ts`.

- `POST /api/log-reset-attempt`
  - Body: `{ identifier: string, status: 'success'|'fail', reason?: string }`
  - Persiste cada intento en tabla de auditoría.

- `POST /api/init-neon`
  - Inicialización controlada del esquema (según permisos/config). Úsalo sólo en entornos de desarrollo o protegidos.

Nota: Los nombres exactos de campos pueden variar con tu esquema. Revisa `sql/init_neon.sql` y `lib/db.ts` para detalles.

## Middleware y Seguridad
- `middleware.ts`: puede manejar rate limiting básico, protección de rutas o encabezados de seguridad.
- Envía sólo información mínima al cliente; los endpoints deberían validar input y no filtrar datos sensibles.
- Usa SSL en Neon (`sslmode=require`) y en despliegue.
- Considera añadir:
  - Rate limiting por IP/identificador en `log-reset-attempt`
  - Captcha/turnstile para mitigar abuso
  - Logs estructurados y alertas

## Flujo de Reseteo
1) Usuario ingresa identificador en `password-reset-form.tsx` o flujo Microsoft.
2) Frontend llama `POST /api/verify-user`.
3) Si existe/permite reset, se registra intento via `POST /api/log-reset-attempt`.
4) (Extensión) Enviar correo con token/OTP o redirigir a proveedor externo.

Componentes clave:
- `components/password-reset-form.tsx`: UI principal de reseteo.
- `components/microsoft-reset-form.tsx`: variante para flujos Microsoft/SSO.
- `components/db-status-indicator.tsx`: muestra salud de DB consultando `/api/check-db-connection`.

## Resolución de Problemas
- Error de conexión a DB: revisa `DATABASE_URL` y que `sslmode=require` esté presente para Neon.
- Migraciones/SQL fallan: asegúrate de correr `npm run db:init` con la URL correcta.
- 403 al hacer push a GitHub: verifica SSH o usa HTTPS+PAT.
- Variables no disponibles: en Next.js, las variables que necesitas en el cliente deben iniciar con `NEXT_PUBLIC_`.

## Roadmap breve
- Añadir tokens de reseteo con expiración y almacenamiento seguro.
- Integración de correo (resend, SES, etc.).
- Rate limiting y auditoría avanzada.
- Tests e2e mínimos para flujo de reseteo.

## Licencia
Ver `LICENSE` en la raíz del proyecto.
