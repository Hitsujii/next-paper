'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const MoonIcon = () => (
  <svg
    aria-hidden="true"
    className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 7.5A9 9 0 1 1 12 3Z" />
  </svg>
)

const SunIcon = () => (
  <svg
    aria-hidden="true"
    className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
)

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      id="theme-btn"
      type="button"
      className="focus-outline relative size-12 p-4 hover:text-[var(--accent)] sm:size-8"
      aria-label={mounted ? resolvedTheme || 'system' : 'theme'}
      aria-live="polite"
      onClick={toggleTheme}
    >
      <MoonIcon />
      <SunIcon />
    </button>
  )
}

export default ThemeSwitch
