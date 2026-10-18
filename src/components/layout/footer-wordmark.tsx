import type { CSSProperties } from 'react'
import { useWordmarkMotion } from '#/hooks/use-wordmark-motion'
import { cn } from '#/lib/utils'

const WORD = 'treasure'

// Oversized wordmark bleeding off the footer's bottom edge. Each letter rises in its own
// clipped box; a roll sends it up and out while its twin rises into place.
export function FooterWordmark() {
  const letters = [...WORD]
  const { ref, shown, rolling } = useWordmarkMotion<HTMLParagraphElement>(
    letters.length,
  )

  return (
    <div className="mt-16 px-[2vw] @container">
      <p
        ref={ref}
        aria-hidden
        data-shown={shown}
        style={{ '--n': letters.length } as CSSProperties}
        className="-mb-[0.2em] flex justify-between font-display text-[23.5cqw] leading-none font-bold select-none"
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            className={cn('wordmark-letter', rolling === i && 'is-rolling')}
            style={{ '--i': i } as CSSProperties}
          >
            <span>{letter}</span>
            <span>{letter}</span>
          </span>
        ))}
      </p>
    </div>
  )
}
