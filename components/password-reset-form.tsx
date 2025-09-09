"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Reemplazado RadioGroup por selects nativos para mejor compatibilidad
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ExternalLink, Eye, ShieldAlert, Lock, AlertCircle, Shield, Check } from "@/components/icons"

// Importar el nuevo componente
import { DbStatusIndicator } from "@/components/db-status-indicator"

// Lista simulada de usuarios válidos para verificación en modo offline
const validUsers = [
  {
    username: "jperez",
    role: "developer",
    fullname: "Juan Pérez",
    department: "ingenieria",
    position: "Desarrollador Senior",
  },
  {
    username: "mrodriguez",
    role: "developer",
    fullname: "María Rodríguez",
    department: "ciberseguridad",
    position: "Analista de Seguridad",
  },
  { username: "alopez", role: "executive", fullname: "Ana López", department: "ventas", position: "Gerente de Ventas" },
  {
    username: "cgomez",
    role: "executive",
    fullname: "Carlos Gómez",
    department: "finanzas",
    position: "Director Financiero",
  },
  {
    username: "admin",
    role: "developer",
    fullname: "Administrador",
    department: "ingenieria",
    position: "Administrador de Sistemas",
  },
  {
    username: "test",
    role: "executive",
    fullname: "Usuario de Prueba",
    department: "estrategia",
    position: "Analista de Negocio",
  },
]

// Definimos las opciones de departamento como un array para simplificar
const departmentOptions = [
  { value: "administracion", label: "Administración Corporativa" },
  { value: "finanzas", label: "Finanzas" },
  { value: "legal", label: "Legal y Cumplimiento" },
  { value: "tecnologia", label: "Tecnología e Ingeniería" },
  { value: "ia-ml", label: "Inteligencia Artificial y Machine Learning" },
  { value: "ventas", label: "Ventas y Desarrollo de Negocios" },
  { value: "marketing", label: "Marketing y Relaciones Públicas" },
  { value: "soporte", label: "Atención y Soporte al Cliente" },
  { value: "seguridad", label: "Seguridad Digital y Protección de Datos" },
  { value: "operaciones", label: "Operaciones y Centros de Datos" },
  { value: "investigacion", label: "Investigación y Tecnología Espacial" },
  { value: "rrhh", label: "Recursos Humanos y Cultura Corporativa" },
  { value: "fundacion", label: "Fundación Humanitaria de Opendex" },
]

// Primero, añadir la estructura de datos de puestos por departamento después de la constante departmentOptions

// Definimos los puestos por departamento
const positionsByDepartment = [
  {
    department: "administracion",
    label: "Administración Corporativa",
    positions: [
      "Director de Administración Corporativa",
      "Coordinador de Proyectos Corporativos",
      "Analista Administrativo",
      "Asistente Ejecutivo",
    ],
  },
  {
    department: "finanzas",
    label: "Finanzas",
    positions: [
      "CFO (Chief Financial Officer / Director Financiero)",
      "Gerente de Contabilidad",
      "Analista Financiero",
      "Tesorero Corporativo",
      "Especialista en Facturación",
    ],
  },
  {
    department: "legal",
    label: "Legal y Cumplimiento",
    positions: [
      "Director Jurídico (General Counsel)",
      "Abogado Corporativo",
      "Especialista en Cumplimiento Normativo",
      "Analista de Contratos",
      "Oficial de Protección de Datos (DPO)",
    ],
  },
  {
    department: "tecnologia",
    label: "Tecnología e Ingeniería",
    positions: [
      "CTO (Chief Technology Officer / Director de Tecnología)",
      "Ingeniero de Software (Frontend / Backend / Fullstack)",
      "Ingeniero DevOps",
      "Ingeniero de Infraestructura",
      "Arquitecto de Soluciones Cloud",
      "Ingeniero de Calidad (QA Tester)",
    ],
  },
  {
    department: "ia-ml",
    label: "Inteligencia Artificial y Machine Learning",
    positions: [
      "Director de IA y ML",
      "Ingeniero de Machine Learning",
      "Científico de Datos (Data Scientist)",
      "Especialista en Procesamiento de Lenguaje Natural (NLP)",
      "Ingeniero de Visión Computacional",
    ],
  },
  {
    department: "ventas",
    label: "Ventas y Desarrollo de Negocios",
    positions: [
      "CRO (Chief Revenue Officer / Director de Ventas)",
      "Gerente de Desarrollo de Negocios (BDM)",
      "Ejecutivo de Ventas Corporativas",
      "Representante de Ventas de Campo",
      "Consultor Comercial",
    ],
  },
  {
    department: "marketing",
    label: "Marketing y Relaciones Públicas",
    positions: [
      "CMO (Chief Marketing Officer / Director de Marketing)",
      "Gerente de Marketing Digital",
      "Especialista en Comunicación Corporativa",
      "Community Manager",
      "Diseñador Gráfico Corporativo",
    ],
  },
  {
    department: "soporte",
    label: "Atención y Soporte al Cliente",
    positions: [
      "Director de Experiencia del Cliente",
      "Gerente de Soporte Técnico",
      "Especialista en Atención a Clientes",
      "Agente de Soporte de Nivel 1 y 2",
      "Coordinador de Servicio al Cliente",
    ],
  },
  {
    department: "seguridad",
    label: "Seguridad Digital y Protección de Datos",
    positions: [
      "CISO (Chief Information Security Officer)",
      "Analista de Ciberseguridad",
      "Especialista en Protección de Infraestructura",
      "Auditor de Seguridad",
      "Ingeniero en Respuesta ante Incidentes",
    ],
  },
  {
    department: "operaciones",
    label: "Operaciones y Centros de Datos",
    positions: [
      "COO (Chief Operating Officer / Director de Operaciones)",
      "Gerente de Data Centers",
      "Ingeniero de Redes y Comunicaciones",
      "Técnico de Operaciones de Servidores",
      "Especialista en Logística de Hardware",
    ],
  },
  {
    department: "investigacion",
    label: "Investigación y Tecnología Espacial",
    positions: [
      "Director de Innovación y Proyectos Espaciales",
      "Ingeniero Aeroespacial",
      "Investigador en Robótica Autónoma",
      "Ingeniero de Propulsión",
      "Científico de Materiales",
    ],
  },
  {
    department: "rrhh",
    label: "Recursos Humanos y Cultura Corporativa",
    positions: [
      "CHRO (Chief Human Resources Officer / Director de RH)",
      "Gerente de Reclutamiento y Selección",
      "Especialista en Capacitación y Desarrollo",
      "Coordinador de Cultura Organizacional",
      "Analista de Nómina y Beneficios",
    ],
  },
  {
    department: "fundacion",
    label: "Fundación Humanitaria de Opendex",
    positions: [
      "Director de la Fundación",
      "Coordinador de Programas Sociales",
      "Especialista en Relaciones Comunitarias",
      "Gestor de Proyectos Humanitarios",
      "Analista de Impacto Social",
    ],
  },
]

// Constantes para la validación del motivo
const MIN_REASON_LENGTH = 0
const MAX_REASON_LENGTH = 500

// URLs para restablecimiento de contraseña
const MICROSOFT_RESET_URL = "https://passwordreset.microsoftonline.com/"
const GOOGLE_RESET_URL = "https://accounts.google.com/signin/recovery"

// Función para mostrar solo las iniciales y ocultar el resto con asteriscos
const maskFullName = (fullName: string): string => {
  if (!fullName) return ""

  return fullName
    .split(" ")
    .map((word) => {
      if (!word) return ""
      if (word.length === 1) return word
      return word[0] + "*".repeat(word.length - 1)
    })
    .join(" ")
}

export default function PasswordResetForm() {
  // Control de modo offline: deshabilitado en producción a menos que se habilite explícitamente
  const OFFLINE_ALLOWED =
    (process.env.NEXT_PUBLIC_ALLOW_OFFLINE_MODE === "true") || process.env.NODE_ENV !== "production"

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    department: "",
    position: "",
    isEmployee: "",
    reason: "",
    role: "",
    domain: "opendex.com",
    accountType: "",
  })

  // Dominios permitidos según el rol
  const devDomains = ["opendex.dev", "cloud.opendex.dev"]
  const execDomains = ["opendex.com", "cloud.opendex.com"]
  const allowedDomains =
    formData.role === "developer"
      ? devDomains
      : formData.role === "executive"
        ? execDomains
        : [...devDomains, ...execDomains]

  // Ahora, añadir un estado para almacenar los puestos disponibles según el departamento seleccionado
  // Añadir esto dentro de la función PasswordResetForm, justo después de los otros estados

  const [availablePositions, setAvailablePositions] = useState<string[]>([])
  const allPositions = useMemo(() => positionsByDepartment.flatMap((d) => d.positions), [])
  const positionToDepartment = useMemo(() => {
    const map = new Map<string, string>()
    positionsByDepartment.forEach((d) => d.positions.forEach((p) => map.set(p, d.department)))
    return map
  }, [])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)
  // Mostrar el nombre sin ocultarlo
  const [userExists, setUserExists] = useState<boolean | null>(null)
  const [verifiedUser, setVerifiedUser] = useState<{
    username: string
    role: string
    fullname: string
    department: string | null
    position: string | null
  } | null>(null)
  const [isVerifyingUser, setIsVerifyingUser] = useState(false)
  const [showCopyPasteWarning, setShowCopyPasteWarning] = useState(false)
  const [dbStatus, setDbStatus] = useState<"connected" | "not_configured" | "error" | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Estados para la verificación anti-bot estilo Cloudflare
  const [showHumanVerification, setShowHumanVerification] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isHuman, setIsHuman] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [isChecked, setIsChecked] = useState(false)

  // Primero, añadir un nuevo estado para controlar la animación de cargando justo después de los otros estados:
  const [isLoading, setIsLoading] = useState(false)

  // Añadir un efecto para actualizar los puestos disponibles cuando cambia el departamento
  // Añadir esto dentro de la función PasswordResetForm, junto con los otros useEffect

  useEffect(() => {
    if (formData.department) {
      const departmentData = positionsByDepartment.find((d) => d.department === formData.department)
      if (departmentData) {
        setAvailablePositions(departmentData.positions)
        // Si hay un puesto seleccionado que no está en la nueva lista, limpiarlo
        if (formData.position && !departmentData.positions.includes(formData.position)) {
          setFormData((prev) => ({ ...prev, position: "" }))
        }
      } else {
        setAvailablePositions([])
      }
    } else {
      setAvailablePositions([])
    }
  }, [formData.department])

  // Inicializar la base de datos (Neon) en desarrollo
  const setupDatabase = async () => {
    try {
      const response = await fetch("/api/init-neon", { method: "POST" })
      if (!response.ok) {
        console.error("Error initializing database:", response.status, response.statusText)
        return false
      }
      const data = await response.json()
      if (data.ok) {
        // Recargar para verificar la conexión nuevamente
        window.location.reload()
        return true
      }
      console.error("DB init response:", data)
      return false
    } catch (error) {
      console.error("Error initializing database:", error)
      return false
    }
  }

  // Verificar la conexión a la base de datos al cargar
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await fetch("/api/check-db-connection")

        if (!response.ok) {
          console.error("Error en la respuesta del servidor:", response.status, response.statusText)
          setDbStatus("error")
          setIsOfflineMode(OFFLINE_ALLOWED)
          return
        }

        const data = await response.json()

        if (data.connected) {
          if (data.configured === false) {
            setDbStatus("not_configured")
            setIsOfflineMode(OFFLINE_ALLOWED)
          } else {
            setDbStatus("connected")
            setIsOfflineMode(false)
          }
        } else {
          setDbStatus("error")
          setIsOfflineMode(OFFLINE_ALLOWED)
        }
      } catch (error) {
        console.error("Error checking DB connection:", error)
        setDbStatus("error")
        setIsOfflineMode(OFFLINE_ALLOWED)
      }
    }

    checkDbConnection()
  }, [])

  // Función para prevenir copiar y pegar
  const preventCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    setShowCopyPasteWarning(true)

    // Ocultar el mensaje de advertencia después de 3 segundos
    setTimeout(() => {
      setShowCopyPasteWarning(false)
    }, 3000)
  }

  // Función para prevenir cortar
  const preventCut = (e: React.ClipboardEvent) => {
    e.preventDefault()
    setShowCopyPasteWarning(true)

    // Ocultar el mensaje de advertencia después de 3 segundos
    setTimeout(() => {
      setShowCopyPasteWarning(false)
    }, 3000)
  }

  // Función para prevenir pegar
  const preventPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    setShowCopyPasteWarning(true)

    // Ocultar el mensaje de advertencia después de 3 segundos
    setTimeout(() => {
      setShowCopyPasteWarning(false)
    }, 3000)
  }

  // Efecto para deshabilitar el menú contextual en los campos del formulario
  useEffect(() => {
    const formInputs = document.querySelectorAll("input, textarea")

    const handleContextMenu = (e: Event) => {
      e.preventDefault()
      return false
    }

    formInputs.forEach((input) => {
      input.addEventListener("contextmenu", handleContextMenu)
    })

    return () => {
      formInputs.forEach((input) => {
        input.removeEventListener("contextmenu", handleContextMenu)
      })
    }
  }, [])

  // (El "ojito" fue removido; el nombre se muestra completo por solicitud)

  // Función para mostrar la verificación de humano
  // Función para mostrar la verificación de humano
  // const handleShowHumanVerification = () => {
  //   if (!validateForm()) return
  //   setShowHumanVerification(true)
  //   setVerificationError("")
  //   setIsChecked(false)
  // }

  // Función para verificar que es humano
  const verifyHuman = () => {
    setIsVerifying(true)

    // Simulamos una verificación con un pequeño retraso
    setTimeout(() => {
      setIsHuman(true)
      setShowHumanVerification(false)
      setIsVerifying(false)
      handleSubmitAfterVerification()
    }, 1500)
  }

  const checkUserExists = async (username: string, role: string) => {
    if (!username.trim() || !role) {
      setUserExists(null)
      setVerifiedUser(null)
      return
    }

    try {
      setIsVerifyingUser(true)

      // Si estamos en modo offline y está permitido, verificamos con la lista local
      if (isOfflineMode && OFFLINE_ALLOWED) {
        setTimeout(() => {
          const user = validUsers.find(
            (user) => user.username.toLowerCase() === username.toLowerCase() && user.role === role,
          )

          setUserExists(!!user)

          if (user) {
            setVerifiedUser({
              username: user.username,
              role: user.role,
              fullname: user.fullname,
              department: user.department || null,
              position: user.position || null,
            })
            setFormData((prev) => ({
              ...prev,
              fullName: user.fullname || prev.fullName,
              department: user.department || prev.department,
              position: user.position || prev.position,
            }))
          } else {
            setVerifiedUser(null)
          }

          setIsVerifyingUser(false)
        }, 500)
        return
      }

      // Llamada a la API real
      const response = await fetch("/api/verify-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, role }),
      })

      if (!response.ok) {
        // Si hay un error en la API, cambiamos a modo offline
        console.error("Error en la API de verificación:", response.status, response.statusText)
        setIsOfflineMode(OFFLINE_ALLOWED)

        if (OFFLINE_ALLOWED) {
          // Verificar con la lista local (solo si permitido)
          const user = validUsers.find(
            (user) => user.username.toLowerCase() === username.toLowerCase() && user.role === role,
          )

          setUserExists(!!user)

          if (user) {
            setFormData((prev) => ({
              ...prev,
              fullName: user.fullname || prev.fullName,
              department: user.department || prev.department,
              position: user.position || prev.position,
            }))
          }

          setIsVerifyingUser(false)
          return
        } else {
          // En producción sin offline permitido, no afirmar existencia
          setUserExists(null)
          setIsVerifyingUser(false)
          return
        }
      }

      const data = await response.json()

      setUserExists(data.exists)

      // Si el usuario existe, podemos autocompletar algunos campos
      if (data.exists && data.user) {
        setVerifiedUser({
          username,
          role,
          fullname: data.user.fullname,
          department: data.user.department,
          position: data.user.position,
        })
        setFormData((prev) => ({
          ...prev,
          fullName: data.user.fullname || prev.fullName,
          department: data.user.department || prev.department,
          position: data.user.position,
        }))
      } else {
        setVerifiedUser(null)
      }
    } catch (error) {
      console.error("Error checking user:", error)
      setUserExists(null)

      // Fallback a modo offline si hay un error (solo si permitido)
      setIsOfflineMode(OFFLINE_ALLOWED)

      if (OFFLINE_ALLOWED) {
        const user = validUsers.find(
          (user) => user.username.toLowerCase() === username.toLowerCase() && user.role === role,
        )

        setUserExists(!!user)

        if (user) {
          setVerifiedUser({
            username: user.username,
            role: user.role,
            fullname: user.fullname,
            department: user.department || null,
            position: user.position || null,
          })
          setFormData((prev) => ({
            ...prev,
            fullName: user.fullname || prev.fullName,
            department: user.department || prev.department,
            position: user.position || prev.position,
          }))
        } else {
          setVerifiedUser(null)
        }
      } else {
        setUserExists(null)
        setVerifiedUser(null)
      }
    } finally {
      setIsVerifyingUser(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check required fields
    if (!formData.fullName.trim()) newErrors.fullName = "El nombre completo es obligatorio"

    if (!formData.role) newErrors.role = "Debe seleccionar su rol en la empresa"

    if (!formData.username.trim()) {
      newErrors.email = "El nombre de usuario es obligatorio"
    } else {
      // Validate username format (no spaces or special characters except dots and underscores)
      const usernameRegex = /^[a-zA-Z0-9._]+$/
      if (!usernameRegex.test(formData.username)) {
        newErrors.email = "El nombre de usuario solo puede contener letras, números, puntos y guiones bajos"
      }
    }

    if (!formData.department) newErrors.department = "Debe seleccionar un departamento"
    if (!formData.position.trim()) newErrors.position = "El puesto es obligatorio"
    if (!formData.isEmployee) newErrors.isEmployee = "Debe seleccionar una opción"
    if (!formData.accountType) newErrors.accountType = "Debe seleccionar el tipo de cuenta"

    if (formData.isEmployee === "no") {
      newErrors.isEmployee = "Sólo los colaboradores de Opendex Corporation pueden continuar"
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "El motivo es obligatorio"
    } else if (formData.reason.length > MAX_REASON_LENGTH) {
      newErrors.reason = `El motivo no debe exceder los ${MAX_REASON_LENGTH} caracteres`
    }

    if (!userExists && formData.username.trim()) {
      newErrors.email = "El usuario ingresado no existe en nuestro sistema"
    }

    // Si hay datos verificados, deben coincidir exactamente
    if (verifiedUser) {
      if (formData.fullName !== verifiedUser.fullname) {
        newErrors.fullName = "El nombre debe coincidir con el registrado"
      }
      if ((formData.department || "") !== (verifiedUser.department || "")) {
        newErrors.department = "El departamento debe coincidir con el registrado"
      }
      if ((formData.position || "") !== (verifiedUser.position || "")) {
        newErrors.position = "El puesto debe coincidir con el registrado"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Evitar cambios si los datos están verificados desde la BD
    if (verifiedUser && (name === 'fullName' || name === 'department' || name === 'position')) {
      return
    }
    if (name === 'position') {
      // Si selecciona un puesto, inferir automáticamente el departamento correspondiente
      const inferredDept = positionToDepartment.get(value)
      setFormData((prev) => ({ ...prev, position: value, department: inferredDept || prev.department }))
      // Limpiar errores relacionados si aplican
      setErrors((prev) => {
        const next = { ...prev }
        delete next.position
        if (inferredDept) delete next.department
        return next
      })
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => {
      const isDev = value === "developer"
      const validSet = isDev ? devDomains : execDomains
      const defaultDomain = isDev ? "opendex.dev" : "opendex.com"
      const nextDomain = validSet.includes(prev.domain) ? prev.domain : defaultDomain

      return {
        ...prev,
        role: value,
        domain: nextDomain,
        email: prev.username ? `${prev.username}@${nextDomain}` : prev.email,
      }
    })

    // Cambiar rol invalida la verificación actual
    setVerifiedUser(null)
    if (formData.username) {
      checkUserExists(formData.username, value)
    } else {
      setUserExists(null)
    }
  }

  const logResetAttempt = async (success: boolean) => {
    if (isOfflineMode) {
      console.log("Modo offline: Registro de intento simulado", {
        username: formData.username,
        role: formData.role,
        fullName: formData.fullName,
        department: formData.department,
        position: formData.position,
        accountType: formData.accountType,
        success,
      })
      return true
    }

    try {
      const response = await fetch("/api/log-reset-attempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          role: formData.role,
          fullName: formData.fullName,
          department: formData.department,
          position: formData.position,
          accountType: formData.accountType,
          success,
        }),
      })

      if (!response.ok) {
        console.error("Error logging reset attempt:", response.statusText)
        return false
      }

      return true
    } catch (error) {
      console.error("Error logging reset attempt:", error)
      return false
    }
  }

  const handleSubmitAfterVerification = async () => {
    setIsSubmitting(true)

    try {
      // Registrar el intento de restablecimiento
      const logged = await logResetAttempt(true)
      if (!logged) {
        setIsSubmitting(false)
        return
      }

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(true)

        // Iniciar cuenta regresiva para redirección
        let count = 3
        const timer = setInterval(() => {
          count -= 1
          setCountdown(count)

          if (count <= 0) {
            clearInterval(timer)
            // Redirigir según el tipo de cuenta
            const resetUrl = formData.accountType === "microsoft" ? MICROSOFT_RESET_URL : GOOGLE_RESET_URL
            window.location.href = resetUrl
          }
        }, 1000)
      }, 1500)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
      // Registrar el intento fallido
      await logResetAttempt(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isHuman) {
      handleSubmitAfterVerification()
    } else {
      // Ya no necesitamos mostrar el diálogo
      validateForm()
    }
  }

  // Determinar la URL de redirección según el tipo de cuenta
  const getResetUrl = () => {
    return formData.accountType === "microsoft" ? MICROSOFT_RESET_URL : GOOGLE_RESET_URL
  }

  // Determinar si el contador de caracteres debe mostrarse en rojo
  const isReasonTooLong = formData.reason.length > MAX_REASON_LENGTH
  const reasonCounterClass = isReasonTooLong ? "text-red-500" : "text-gray-500"

  if (isSuccess) {
    const serviceName = formData.accountType === "microsoft" ? "Microsoft" : "Google"
    const serviceColor =
      formData.accountType === "microsoft" ? "bg-[#0078d4] hover:bg-[#106ebe]" : "bg-[#4285F4] hover:bg-[#3367D6]"

    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <div className="text-green-600 text-xl font-semibold mb-4">Verificación completada correctamente</div>
        <p className="text-gray-600 mb-4">
          Su identidad ha sido verificada. Redirigiendo al portal oficial de {serviceName} en {countdown} segundos...
        </p>
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-[#003366] animate-spin mb-4" />
          <Button
            onClick={() => (window.location.href = getResetUrl())}
            className={`${serviceColor} text-white flex items-center justify-center gap-2`}
          >
            Ir ahora a {serviceName} <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col relative z-10">
      <DbStatusIndicator status={dbStatus} onSetupDb={dbStatus === "not_configured" ? setupDatabase : undefined} />

      {isOfflineMode && dbStatus !== "not_configured" && (
        <div className="mb-4 px-4 py-3 rounded-md bg-blue-50 text-blue-700 text-sm flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Modo sin conexión activo</p>
            <p className="text-xs">
              Funcionando con datos locales. La verificación de usuarios y el registro de intentos se realizan
              localmente.
            </p>
          </div>
        </div>
      )}

      {showCopyPasteWarning && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">No se permite copiar ni pegar</p>
            <p className="text-sm">Por razones de seguridad, debe ingresar la información manualmente.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 mb-4">
          Todos los campos son obligatorios. Por seguridad, no se permite copiar ni pegar información.
        </p>

        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center">
            Nombre completo <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              disabled={Boolean(verifiedUser)}
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
              onCut={preventCut}
              className={`${errors.fullName ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="flex items-center">
            ¿Cuál es su rol en la empresa? <span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className={`w-full px-3 h-[30px] border rounded-xl ${errors.role ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#003366]`}
            required
          >
            <option value="" disabled>
              Seleccione su rol
            </option>
            <option value="developer">Desarrollador / Programador</option>
            <option value="executive">Ejecutivo / Colaborador</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center">
            Correo electrónico corporativo <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex items-center">
            <Input
              id="username"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={(e) => {
                const username = e.target.value
                setFormData((prev) => ({
                  ...prev,
                  username,
                  email: username ? `${username}@${prev.domain || 'opendex.com'}` : "",
                }))
                // Cambiar username invalida la verificación actual
                setVerifiedUser(null)
                setUserExists(null)
              }}
              onBlur={() => {
                if (formData.username && formData.role) {
                  checkUserExists(formData.username, formData.role)
                }
              }}
              onCopy={preventCopyPaste}
              onPaste={preventPaste}
              onCut={preventCut}
              className={`rounded-r-none ${
                errors.email
                  ? "border-red-500"
                  : userExists === false
                    ? "border-red-500"
                    : userExists === true
                      ? "border-green-500"
                      : ""
              }`}
              required
            />
            <div className="flex items-center">
              <select
                name="domain"
                value={formData.domain}
                onChange={(e) => {
                  const domain = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    domain,
                    email: prev.username ? `${prev.username}@${domain}` : prev.email,
                  }))
                }}
                className="bg-gray-100 border border-l-0 border-gray-300 h-[30px] px-2 text-gray-700 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                {allowedDomains.map((d) => (
                  <option key={d} value={d}>
                    @{d}
                  </option>
                ))}
              </select>
              {isVerifyingUser && <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-500" />}
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          {userExists === false && (
            <p className="text-red-500 text-sm mt-1">No existe ningún usuario con ese nombre en el sistema.</p>
          )}
          {userExists === true && <p className="text-green-500 text-sm mt-1">Usuario verificado correctamente.</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="flex items-center">
            Departamento / Área <span className="text-red-500 ml-1">*</span>
          </Label>
          {verifiedUser ? (
            <Input
              id="department"
              name="department"
              type="text"
              value={verifiedUser.department || ''}
              disabled
              className={`w-full h-[30px] ${errors.department ? 'border-red-500' : ''}`}
            />
          ) : (
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-3 h-[30px] border rounded-xl ${
                errors.department ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#003366]`}
              required
            >
              <option value="" disabled>
                Seleccione su departamento
              </option>
              {departmentOptions.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          )}
          {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="flex items-center">
            Puesto <span className="text-red-500 ml-1">*</span>
          </Label>
          {verifiedUser ? (
            <Input
              id="position"
              name="position"
              type="text"
              value={verifiedUser.position || ''}
              disabled
              className={`w-full h-[30px] ${errors.position ? 'border-red-500' : ''}`}
            />
          ) : (
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`w-full px-3 h-[30px] border rounded-[12px] ${
                errors.position ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#003366]`}
              required
            >
              <option value="" disabled>
                Seleccione su puesto
              </option>
              {(formData.department ? availablePositions : allPositions).map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          )}
          {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isEmployee" className="flex items-center">
            ¿Eres un empleado actual de Opendex Corporation? <span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id="isEmployee"
            name="isEmployee"
            value={formData.isEmployee}
            onChange={(e) => handleRadioChange("isEmployee", e.target.value)}
            className={`w-full px-3 h-[30px] border rounded-xl ${errors.isEmployee ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#003366]`}
            required
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
          {errors.isEmployee && <p className="text-red-500 text-sm">{errors.isEmployee}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType" className="flex items-center">
            ¿Su cuenta corporativa es de Microsoft o Google? <span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id="accountType"
            name="accountType"
            value={formData.accountType}
            onChange={(e) => handleRadioChange("accountType", e.target.value)}
            className={`w-full px-3 h-[30px] border rounded-xl ${errors.accountType ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#003366]`}
            required
          >
            <option value="" disabled>
              Seleccione el tipo de cuenta
            </option>
            <option value="microsoft">Microsoft 365</option>
            <option value="google">Google Workspace</option>
          </select>
          {errors.accountType && <p className="text-red-500 text-sm">{errors.accountType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="flex items-center">
            Motivo de restablecimiento de contraseña <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            onCopy={preventCopyPaste}
            onPaste={preventPaste}
            onCut={preventCut}
            rows={4}
            className={errors.reason ? "border-red-500" : ""}
            required
            maxLength={MAX_REASON_LENGTH + 50} // Permitir un poco más para mostrar el error
          />
          <p className={`text-xs flex justify-between ${reasonCounterClass}`}>
            <span>Máximo {MAX_REASON_LENGTH} caracteres.</span>
            <span>
              {formData.reason.length}/{MAX_REASON_LENGTH}
              {isReasonTooLong && " (Límite excedido)"}
            </span>
          </p>
          {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
        </div>

        <Button
          type="submit"
          className="w-full h-[30px] bg-[#003366] hover:bg-[#002244] transition-all flex items-center justify-center gap-2 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : isHuman ? (
            <>Verificar identidad</>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Verificar identidad
            </>
          )}
        </Button>

        <div className="mt-6 mb-6">
          <div className="w-full border border-gray-200 rounded-md bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Verificación de seguridad</div>
              <img src="/Logotipo%20de%20Opendex.png" alt="Opendex" className="h-5" />
            </div>
            {/* Modificar el div del checkbox para incluir la animación de cargando: */}
            <label className="flex items-center w-full cursor-pointer p-3 hover:bg-gray-50/30 transition-colors">
              <div className="flex items-center flex-1">
                <div
                  className={`h-5 w-5 flex items-center justify-center mr-3 relative ${isLoading ? "" : "border border-gray-400 rounded-full bg-white"}`}
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-transparent border-t-[#0078d4] border-r-[#0078d4] animate-spin"></div>
                    </div>
                  )}
                  {isChecked && !isLoading && <Check className="h-3.5 w-3.5 text-[#0078d4]" />}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => {
                      setIsChecked(true)
                      setIsLoading(true)
                      setTimeout(async () => {
                        setIsLoading(false)
                        setIsHuman(true)
                        // Asegurar verificación de usuario antes de validar/redirigir
                        if (formData.username && formData.role) {
                          await checkUserExists(formData.username, formData.role)
                        }
                        // Solo continuar si existe el usuario y el formulario es válido
                        if (userExists === true && validateForm()) {
                          handleSubmitAfterVerification()
                        }
                      }, 1500)
                    }}
                  />
                </div>
                <span className="text-sm text-gray-700">Confirmo que soy un usuario legítimo</span>
              </div>
              <Shield className="h-4 w-4 text-gray-400 ml-2" />
            </label>
            <div className="text-xs text-gray-500 flex items-center justify-end mt-2">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-xs">
                Política de privacidad
              </a>
              <span className="mx-1 text-gray-400">|</span>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-xs">
                Términos de servicio
              </a>
            </div>
          </div>
        </div>
      </form>

      <footer className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-start">
          <Lock size={14} className="mr-2 text-[#003366] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">
              Aviso: Este formulario utiliza protocolos seguros de transferencia de datos (HTTPS).
            </p>
            <p>
              Por tu seguridad, verifica siempre que la dirección web comience con https:// y corresponda al dominio
              oficial de Opendex Corporation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
