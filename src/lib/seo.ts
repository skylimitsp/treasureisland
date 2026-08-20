import { SITE } from '#/constants/site'
import { breadcrumbLd } from '#/lib/structured-data'

export interface SeoInput {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  path?: string
  type?: 'website' | 'article'
  noindex?: boolean
  keywords?: string
  // schema.org nodes injected as <script type="application/ld+json">.
  jsonLd?: object | Array<object>
  // Shorthand: emits a BreadcrumbList from these crumbs.
  breadcrumbs?: Array<{ name: string; path: string }>
  // Pagination rel links for paginated list views.
  prev?: string
  next?: string
}

// Makes relative asset paths absolute for social crawlers.
function absolute(value: string): string {
  return value.startsWith('http') ? value : `${SITE.url}${value}`
}

// Builds a full meta + canonical set for a route's `head`; pages override root.
export function seo(input: SeoInput = {}) {
  const title = input.title
    ? `${input.title} · ${SITE.name}`
    : SITE.defaultTitle
  const description = input.description ?? SITE.description
  // The site default OG image is 1200×630, so pages that don't set one still
  // get correct dimensions; custom images only declare dims when passed.
  const usingDefaultImage = !input.image
  const image = absolute(input.image ?? SITE.ogImage)
  const imageAlt = input.imageAlt ?? title
  const imageWidth = input.imageWidth ?? (usingDefaultImage ? 1200 : undefined)
  const imageHeight = input.imageHeight ?? (usingDefaultImage ? 630 : undefined)
  const url = input.path ? absolute(input.path) : SITE.url

  const meta = [
    { title },
    { name: 'description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: SITE.twitter },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: imageAlt },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:locale', content: SITE.locale },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:secure_url', content: image },
    { property: 'og:image:alt', content: imageAlt },
    // Declaring dimensions lets scrapers render the large card without refetching.
    ...(imageWidth
      ? [{ property: 'og:image:width', content: String(imageWidth) }]
      : []),
    ...(imageHeight
      ? [{ property: 'og:image:height', content: String(imageHeight) }]
      : []),
    {
      name: 'robots',
      content: input.noindex ? 'noindex, nofollow' : 'index, follow',
    },
    ...(input.keywords ? [{ name: 'keywords', content: input.keywords }] : []),
  ]

  const links = [
    { rel: 'canonical', href: url },
    ...(input.prev ? [{ rel: 'prev', href: absolute(input.prev) }] : []),
    ...(input.next ? [{ rel: 'next', href: absolute(input.next) }] : []),
  ]

  // Collect JSON-LD nodes: explicit ones plus a breadcrumb shorthand.
  const nodes: Array<object> = []
  if (input.breadcrumbs?.length) nodes.push(breadcrumbLd(input.breadcrumbs))
  if (Array.isArray(input.jsonLd)) nodes.push(...input.jsonLd)
  else if (input.jsonLd) nodes.push(input.jsonLd)

  const scripts = nodes.map((node) => ({
    type: 'application/ld+json',
    children: JSON.stringify(node),
  }))

  return { meta, links, scripts }
}
