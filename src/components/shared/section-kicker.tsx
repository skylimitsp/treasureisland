// Uppercase label above a section title. Optional leading dot.
export function SectionKicker({
  children,
  dot = true,
  className = '',
}: {
  children: React.ReactNode
  dot?: boolean
  className?: string
}) {
  return (
    <p className={`island-kicker ${className}`}>
      {dot ? <span aria-hidden>• </span> : null}
      {children}
    </p>
  )
}
