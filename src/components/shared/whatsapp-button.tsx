import { MessageCircle } from 'lucide-react'

import { cn } from '#/lib/utils'

// WhatsApp hand-off: disabled until the guest's selection is complete.
export function WhatsappButton({
  href,
  label = 'Send via WhatsApp',
  disabled = false,
  variant = 'ghost',
  onBlockedClick,
  className,
}: {
  href: string
  label?: string
  disabled?: boolean
  variant?: 'primary' | 'ghost'
  onBlockedClick?: () => void
  className?: string
}) {
  const classes = cn(
    'btn w-full',
    variant === 'primary' ? 'btn-primary' : 'btn-ghost',
    disabled && 'opacity-60',
    className,
  )
  if (disabled) {
    return (
      <button
        type="button"
        className={classes}
        aria-disabled
        onClick={onBlockedClick}
      >
        <MessageCircle size={16} aria-hidden />
        {label}
      </button>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      <MessageCircle size={16} aria-hidden />
      {label}
    </a>
  )
}
