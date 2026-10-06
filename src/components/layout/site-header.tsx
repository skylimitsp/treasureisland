import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

import { useGsap } from '#/hooks/use-gsap'
import { headerShrink } from '#/lib/animations'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/menu', label: 'Menu' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
] as const

// Routes whose top is a dark full-bleed hero — the chrome stays transparent
// there and frosts on scroll; every other route gets the solid chrome at once.
const HERO_ROUTES: Array<string> = ['/', '/rooms', '/events', '/amenities']

// Global site header: fixed overlay that frosts on scroll (header-shrink), with
// a right-side mobile drawer.
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const pathname = useLocation({ select: (l) => l.pathname })
  const solid = !HERO_ROUTES.includes(pathname)
  const ref = useGsap<HTMLElement>((self) => headerShrink(self))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    // Move focus into the drawer; Escape closes it and returns focus.
    closeBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      menuBtnRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header ref={ref} className={`site-header${solid ? ' is-solid' : ''}`}>
      <div className="header-inner">
        <div className="page-wrap--wide flex items-center justify-between py-4">
          <Link
            to="/"
            className="brand no-underline"
            aria-label="Treasure Island Ada — home"
          >
            <img
              src="/media/logo.webp"
              alt="Treasure Island Ada"
              width={320}
              height={243}
              className="h-12 w-auto md:h-14"
            />
          </Link>

          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link no-underline"
                activeProps={{ className: 'nav-link is-active no-underline' }}
                activeOptions={{ exact: item.to === '/' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/rooms"
              className="btn btn-primary hidden no-underline sm:inline-flex"
            >
              Book Now
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              className="menu-btn flex size-11 items-center justify-center rounded-full md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer (slides in from the right); closes on any link/backdrop. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        aria-hidden={!open}
        className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[82%] flex-col bg-foam shadow-2xl md:hidden"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease',
        }}
      >
        <div className="flex items-center justify-between border-b border-line p-4">
          <span className="display-title text-lg text-sea-ink">Menu</span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              setOpen(false)
              menuBtnRef.current?.focus()
            }}
            aria-label="Close menu"
            className="flex size-11 items-center justify-center rounded-full border border-line text-sea-ink"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sea-ink no-underline hover:bg-black/5"
              activeProps={{
                className:
                  'rounded-md px-3 py-3 font-semibold text-lagoon-deep no-underline hover:bg-black/5',
              }}
              activeOptions={{ exact: item.to === '/' }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/rooms"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-3 no-underline"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  )
}
