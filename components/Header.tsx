'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SearchButton from './SearchButton'
import ThemeSwitch from './ThemeSwitch'

const normalizePath = (path: string) => path.replace(/\/$/, '') || '/'

const MenuIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
)

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const ArchiveIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7h16" />
    <path d="M6 7v12h12V7" />
    <path d="M9 11h6" />
    <path d="M9 15h6" />
    <path d="M8 3h8l1 4H7l1-4Z" />
  </svg>
)

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = normalizePath(usePathname() || '/')
  const title =
    typeof siteMetadata.headerTitle === 'string' ? siteMetadata.headerTitle : siteMetadata.title

  const isActive = (href: string) => {
    const current = normalizePath(pathname)
    const target = normalizePath(href)

    if (target === '/') return current === '/'
    return current === target || current.startsWith(`${target}/`)
  }

  return (
    <>
      <a
        id="skip-to-content"
        href="#main-content"
        className="absolute inset-x-16 -top-full z-50 bg-[var(--background)] px-3 py-2 text-[var(--accent)] backdrop-blur-lg transition-all focus:top-4"
      >
        Skip to content
      </a>

      <header className="app-layout flex flex-col items-center justify-between sm:flex-row">
        <div className="relative flex w-full items-baseline justify-between border-b border-[var(--border)] bg-[var(--background)] py-4 sm:items-center sm:py-6">
          <Link
            href="/"
            aria-label={title}
            className="absolute py-1 text-xl leading-8 font-semibold whitespace-nowrap text-[var(--foreground)] sm:static sm:my-auto sm:text-2xl sm:leading-none"
            onClick={() => setMenuOpen(false)}
          >
            {title}
          </Link>

          <nav
            id="nav-menu"
            className="flex w-full flex-col items-center sm:ms-2 sm:flex-row sm:justify-end sm:space-x-4 sm:py-0"
            aria-label="Primary navigation"
          >
            <button
              id="menu-btn"
              className="focus-outline relative flex size-10 items-center justify-center self-end p-2 sm:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="menu-items"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <CloseIcon
                className={[
                  'absolute size-6 transition-all duration-200',
                  menuOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0',
                ].join(' ')}
              />
              <MenuIcon
                className={[
                  'absolute size-6 transition-all duration-200',
                  menuOpen ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
                ].join(' ')}
              />
            </button>

            <ul
              id="menu-items"
              className={[
                'grid w-44 grid-cols-2 place-content-center gap-2 overflow-hidden transition-all duration-200 ease-out sm:mt-0 sm:flex sm:w-auto sm:translate-y-0 sm:scale-100 sm:gap-x-5 sm:gap-y-0 sm:overflow-visible sm:opacity-100 sm:[&>li]:h-8',
                '[&>li>a]:block [&>li>a]:px-4 [&>li>a]:py-3 [&>li>a]:text-center [&>li>a]:font-medium [&>li>a]:hover:text-[var(--accent)]',
                'sm:[&>li>a]:px-2 sm:[&>li>a]:py-1',
                menuOpen
                  ? 'mt-4 max-h-96 translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none mt-0 max-h-0 -translate-y-2 scale-95 opacity-0 sm:pointer-events-auto sm:max-h-none',
              ].join(' ')}
            >
              {headerNavLinks.map((link) => (
                <li key={link.title} className="col-span-2">
                  <Link
                    href={link.href}
                    className={isActive(link.href) ? 'active-nav' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}

              <li className="col-span-1 flex items-center justify-center">
                <Link
                  href="/projects"
                  className={[
                    'focus-outline relative flex size-12 items-center justify-center p-4 hover:text-[var(--accent)] sm:size-8 sm:p-0',
                    isActive('/projects') ? 'active-nav' : '',
                  ].join(' ')}
                  aria-label="Projects"
                  title="Projects"
                  onClick={() => setMenuOpen(false)}
                >
                  <ArchiveIcon className="size-6" />
                  <span className="sr-only">Projects</span>
                </Link>
              </li>

              <li className="col-span-1 flex items-center justify-center">
                <SearchButton />
              </li>

              <li className="col-span-1 flex items-center justify-center">
                <ThemeSwitch />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
