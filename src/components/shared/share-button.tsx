import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

// Native share sheet where available, otherwise copies the page link.
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    const url = window.location.href
    if (typeof navigator.share === 'function') {
      await navigator.share({ title, url }).catch(() => {})
      return
    }
    // Clipboard is missing on insecure origins; fail quietly there.
    const ok = await navigator.clipboard
      .writeText(url)
      .then(() => true)
      .catch(() => false)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={onShare} className="btn btn-ghost">
      {copied ? (
        <Check size={16} aria-hidden />
      ) : (
        <Share2 size={16} aria-hidden />
      )}
      {copied ? 'Link copied' : 'Share'}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Page link copied to clipboard' : ''}
      </span>
    </button>
  )
}
