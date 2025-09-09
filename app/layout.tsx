import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Opendex Corporation - Restablecimiento de Contraseña",
  description: "Formulario de verificación para restablecimiento de contraseña de Microsoft 365",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preload" as="image" href="/background-login.webp" />
      </head>
      <body className={`${inter.className} bg-gray-100`}>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-[url('/background-login.webp')] bg-cover bg-center bg-no-repeat"
        />
        <div className="relative z-10">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
