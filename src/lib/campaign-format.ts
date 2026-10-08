// Campaign body formatting shared by the admin preview and the sent email.
// Supported: blank line = new paragraph, **bold**, [text](https://…), bare https:// links.

const escapeHtml = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const LINK_STYLE = 'color:#2f7f86;text-decoration:underline'

// Escape first, then add the few allowed tags, so typed HTML can never get through.
function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      `<a href="$2" style="${LINK_STYLE}">$1</a>`,
    )
    .replace(
      /(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g,
      `$1<a href="$2" style="${LINK_STYLE}">$2</a>`,
    )
    .replace(/\n/g, '<br />')
}

export function paragraphs(body: string): Array<string> {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function campaignBodyHtml(body: string): string {
  return paragraphs(body)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;color:#173a40;line-height:1.6;font-size:15px">${inline(p)}</p>`,
    )
    .join('')
}

export function campaignBodyText(body: string): string {
  return paragraphs(body)
    .map((p) =>
      p
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)'),
    )
    .join('\n\n')
}

export const isSafeUrl = (url: string) => /^https?:\/\/[^\s]+$/.test(url)
