import { campaignBodyHtml, campaignBodyText } from '#/lib/campaign-format'
import type { Email } from '#/server/notifications/mailer'

const esc = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

interface CampaignContent {
  subject: string
  preheader: string
  body: string
  ctaLabel: string | null
  ctaUrl: string | null
}

// One subscriber's copy: personal unsubscribe link plus RFC 8058 one-click headers.
export function campaignEmail(
  c: CampaignContent,
  to: string,
  unsubscribeUrl: string,
  siteUrl: string,
): Email {
  const button =
    c.ctaLabel && c.ctaUrl
      ? `<p style="margin:24px 0"><a href="${esc(c.ctaUrl)}" style="background:#2f7f86;color:#ffffff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">${esc(c.ctaLabel)}</a></p>`
      : ''
  const html = `<!doctype html><html><body style="margin:0;background:#f4f8f7;font-family:Arial,sans-serif">
<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${esc(c.preheader)}</span>
<div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff">
<p style="color:#2f7f86;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin:0">Treasure Island Ada</p>
<h1 style="color:#173a40;font-size:24px;line-height:1.3;margin:8px 0 20px">${esc(c.subject)}</h1>
${campaignBodyHtml(c.body)}${button}
<hr style="border:none;border-top:1px solid #dbe5e3;margin:32px 0 16px" />
<p style="color:#4f6b70;font-size:12px;line-height:1.5;margin:0">Treasure Island Ada · Ada Foah, Volta Region, Ghana · (+233) 055 270 1946<br />
You are receiving this because you subscribed at <a href="${esc(siteUrl)}" style="color:#4f6b70">${esc(siteUrl.replace(/^https?:\/\//, ''))}</a>.
<a href="${esc(unsubscribeUrl)}" style="color:#4f6b70">Unsubscribe</a></p>
</div></body></html>`
  const text = [
    c.subject,
    '',
    campaignBodyText(c.body),
    c.ctaLabel && c.ctaUrl ? `\n${c.ctaLabel}: ${c.ctaUrl}` : '',
    '',
    '—',
    'Treasure Island Ada · Ada Foah, Ghana',
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n')
  return {
    to,
    subject: c.subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  }
}
