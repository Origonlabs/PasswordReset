"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCw, Volume2 } from "@/components/icons"

interface MicrosoftResetFormProps {
  userEmail: string
}

export default function MicrosoftResetForm({ userEmail }: MicrosoftResetFormProps) {
  const [email, setEmail] = useState(userEmail)
  const [captcha, setCaptcha] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!captcha) {
      setError("Por favor, ingrese los caracteres de la imagen")
      return
    }

    setError("")
    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      // Aquí normalmente redirigirías a la siguiente página de Microsoft
      // Por ahora, solo mostramos un mensaje de éxito
      alert("Solicitud de restablecimiento enviada. Revise su correo electrónico para los siguientes pasos.")
    }, 2000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <img src="/placeholder.svg?height=24&width=120" alt="Microsoft" className="h-6" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Get back into your account</h1>
        <h2 className="text-lg mb-4">Who are you?</h2>
        <p className="text-sm text-gray-600 mb-4">
          To recover your account, begin by entering your email or username and the characters in the picture or audio
          below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">
            Email or Username: <span className="text-red-500">*</span>
          </Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" required />
          <p className="text-xs text-gray-500">Example: user@contoso.onmicrosoft.com or user@contoso.com</p>
        </div>

        <div className="space-y-2 mt-4">
          <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center mb-2">
            <div className="relative">
              <img
                src="https://sjc.microlink.io/dsszXMRtQ3oYxrD9_WYnXSzGrPN87LwLY7LIw0IGQJd9OTG9ZXfUK4ScHL3j8jbVkcmbDrymPjnq8WAaxtbc3g.jpeg"
                alt="CAPTCHA"
                className="h-16 object-contain"
                style={{ filter: "blur(1px)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600 tracking-widest">
                Q5DK GK3
              </div>
            </div>
            <div className="flex flex-col ml-4">
              <button type="button" className="text-blue-600 flex items-center mb-2">
                <Volume2 size={16} className="mr-1" /> Audio
              </button>
              <button type="button" className="text-blue-600 flex items-center">
                <RefreshCw size={16} className="mr-1" /> New
              </button>
            </div>
          </div>

          <Input
            id="captcha"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            className="w-full"
            placeholder="Enter the characters from the image"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Next"
            )}
          </Button>
          <Button type="button" variant="outline" className="border-gray-300" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>

      <div className="mt-12 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <img src="/placeholder.svg?height=16&width=16" alt="Microsoft logo" className="h-4 w-4 mr-2" />
            <span>© 2023 Microsoft Corporation</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:underline">
              Legal
            </a>
            <a href="#" className="text-gray-600 hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
