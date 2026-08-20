import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { seo } from '#/lib/seo'
import { organizationLd, websiteLd } from '#/lib/structured-data'
import { SiteHeader } from '#/components/layout/site-header'
import { SiteFooter } from '#/components/layout/site-footer'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    // Default meta + site-wide Organization/WebSite JSON-LD; each route sets its
    // own canonical, title, and schema via `seo({ path, jsonLd })`.
    const base = seo({ jsonLd: [organizationLd(), websiteLd()] })
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        ...base.meta,
      ],
      links: [{ rel: 'stylesheet', href: appCss }],
      scripts: base.scripts,
    }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Admin/auth routes render their own chrome — hide the public header/footer.
  const pathname = useLocation({ select: (l) => l.pathname })
  const bareChrome =
    pathname.startsWith('/admin') || pathname.startsWith('/auth')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {bareChrome ? null : <SiteHeader />}
        {children}
        {bareChrome ? null : <SiteFooter />}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
