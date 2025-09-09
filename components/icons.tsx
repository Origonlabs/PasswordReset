import * as React from 'react'
import * as Fluent from '@fluentui/react-icons'

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string }

function FallbackCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function FallbackX(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function FallbackChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function FallbackChevronLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function FallbackChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function FallbackChevronUp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

export const X = (props: IconProps) => {
  const Cmp = (Fluent as any).Dismiss24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackX {...props} />
}

export const Check = (props: IconProps) => {
  const Cmp = (Fluent as any).Checkmark24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const ChevronRight = (props: IconProps) => {
  const Cmp = (Fluent as any).ChevronRight24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackChevronRight {...props} />
}

export const ChevronLeft = (props: IconProps) => {
  const Cmp = (Fluent as any).ChevronLeft24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackChevronLeft {...props} />
}

export const ChevronDown = (props: IconProps) => {
  const Cmp = (Fluent as any).ChevronDown24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackChevronDown {...props} />
}

export const ChevronUp = (props: IconProps) => {
  const Cmp = (Fluent as any).ChevronUp24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackChevronUp {...props} />
}

export const Circle = (props: IconProps) => {
  const Cmp = (Fluent as any).Circle24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Search = (props: IconProps) => {
  const Cmp = (Fluent as any).Search24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const ArrowLeft = (props: IconProps) => {
  const Cmp = (Fluent as any).ArrowLeft24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackChevronLeft {...props} />
}

export const ArrowRight = (props: IconProps) => {
  const Cmp = (Fluent as any).ArrowRight24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackChevronRight {...props} />
}

export const MoreHorizontal = (props: IconProps) => {
  const Cmp = (Fluent as any).MoreHorizontal24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Dot = (props: IconProps) => {
  const Cmp = (Fluent as any).CircleSmall24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const PanelLeft = (props: IconProps) => {
  const Cmp = (Fluent as any).PanelLeft24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const GripVertical = (props: IconProps) => {
  const Cmp = (Fluent as any).ReOrderDotsVertical24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Database = (props: IconProps) => {
  const Cmp = (Fluent as any).Database24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const AlertTriangle = (props: IconProps) => {
  const Cmp = (Fluent as any).Warning24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Code = (props: IconProps) => {
  const Cmp = (Fluent as any).Code24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Download = (props: IconProps) => {
  const Cmp = (Fluent as any).ArrowDownload24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const ExternalLink = (props: IconProps) => {
  const Cmp = (Fluent as any).Open24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Loader2 = (props: IconProps) => {
  // Simple spinner fallback styled via className animate-spin
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" />
    </svg>
  )
}

export const RefreshCw = (props: IconProps) => {
  const Cmp = (Fluent as any).ArrowClockwise24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <Loader2 {...props} />
}

export const Volume2 = (props: IconProps) => {
  const Cmp = (Fluent as any).Speaker224Regular as React.ComponentType<IconProps> | undefined || (Fluent as any).Speaker24Regular
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Eye = (props: IconProps) => {
  const Cmp = (Fluent as any).Eye24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const ShieldAlert = (props: IconProps) => {
  const Cmp = (Fluent as any).ShieldError24Regular as React.ComponentType<IconProps> | undefined || (Fluent as any).ShieldWarning24Regular
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Lock = (props: IconProps) => {
  const Cmp = (Fluent as any).LockClosed24Regular as React.ComponentType<IconProps> | undefined || (Fluent as any).Lock24Regular
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const AlertCircle = (props: IconProps) => {
  const Cmp = (Fluent as any).ErrorCircle24Regular as React.ComponentType<IconProps> | undefined || (Fluent as any).Warning24Regular
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}

export const Shield = (props: IconProps) => {
  const Cmp = (Fluent as any).Shield24Regular as React.ComponentType<IconProps> | undefined
  return Cmp ? <Cmp {...props} /> : <FallbackCircle {...props} />
}
