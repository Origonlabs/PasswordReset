export function OpendexLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="https://public.blob.opendex.dev/Logotipo%20de%20Opendex/1.svg"
        alt="Opendex Logo"
        className="h-8 w-auto"
      />
    </div>
  )
}
