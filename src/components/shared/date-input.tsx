import { CalendarDays } from 'lucide-react'

import type { InputHTMLAttributes } from 'react'

type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'className' | 'placeholder'
> & {
  value: string
  placeholder?: string
  showIcon?: boolean
  // Classes for the outer box (border, padding, spacing) — the input is bare.
  className?: string
}

// Native date picker with a calendar icon and a visible placeholder when empty.
// Mobile browsers render empty date inputs blank, so we draw both ourselves.
export function DateInput({
  value,
  placeholder = 'Add date',
  showIcon = true,
  className = '',
  ...inputProps
}: DateInputProps) {
  const empty = !value

  return (
    <span className={`flex min-w-0 items-center gap-2 ${className}`}>
      {showIcon ? (
        <CalendarDays
          size={16}
          className="shrink-0 text-lagoon-deep"
          aria-hidden
        />
      ) : null}
      <span className="relative min-w-0 flex-1">
        <input
          type="date"
          value={value}
          {...inputProps}
          className={`date-input peer ${empty ? 'is-empty' : ''}`}
        />
        {empty ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-sea-ink-soft peer-focus:hidden"
          >
            {placeholder}
          </span>
        ) : null}
      </span>
    </span>
  )
}
