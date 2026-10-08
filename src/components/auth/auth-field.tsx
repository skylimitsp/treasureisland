import { useId } from 'react'

// Labelled input for the auth forms (44px touch target, visible focus ring).
export function AuthField({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  hint,
  required,
  minLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  hint?: string
  required?: boolean
  minLength?: number
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-sea-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 min-h-11 w-full rounded-md border border-line bg-foam/80 px-3 py-2 text-sea-ink outline-none focus:border-lagoon-deep focus:ring-2 focus:ring-lagoon/30"
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-sea-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
