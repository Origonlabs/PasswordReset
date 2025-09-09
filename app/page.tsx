import PasswordResetForm from "@/components/password-reset-form"
import { OpendexLogo } from "@/components/opendex-logo"

export default function Home() {
  return (
    <main className="min-h-screen p-8 overflow-auto">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-[#003366] p-6 flex justify-center">
          <OpendexLogo className="h-12 w-auto" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#003366] mb-6 text-center">Restablecimiento de Contraseña</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Complete el siguiente formulario para verificar su identidad antes de restablecer su contraseña de Microsoft
            365.
          </p>
          <PasswordResetForm />
        </div>
      </div>
    </main>
  )
}
