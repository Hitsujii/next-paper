'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

const ArrowLeftIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
)

const ArrowNarrowUpIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
)

export default function BackToTopButton() {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const rootElement = document.documentElement

    const handleScroll = () => {
      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight
      const scrollTop = rootElement.scrollTop
      const nextPercent = scrollTotal > 0 ? Math.floor((scrollTop / scrollTotal) * 100) : 0

      setScrollPercent(nextPercent)
      setVisible(scrollTotal > 0 && scrollTop / scrollTotal > 0.3)
    }

    handleScroll()

    document.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const progressStyle = {
    backgroundImage: `conic-gradient(var(--accent), var(--accent) ${scrollPercent}%, transparent ${scrollPercent}%)`,
  } as CSSProperties

  return (
    <>
      <div className="progress-container fixed top-0 z-10 h-1 w-full bg-[var(--background)]">
        <div className="progress-bar h-1 bg-[var(--accent)]" style={{ width: `${scrollPercent}%` }} />
      </div>

      <div
        id="btt-btn-container"
        className={[
          'fixed right-4 bottom-8 z-50',
          'md:sticky md:right-auto md:float-end md:me-1',
          'transition duration-500',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-14 opacity-0',
        ].join(' ')}
      >
        <button
          data-button="back-to-top"
          type="button"
          className={[
            'focus-outline group relative bg-[var(--background)] px-2 py-1',
            'size-14 rounded-full shadow-xl',
            'md:h-8 md:w-fit md:rounded-md md:shadow-none md:focus-visible:rounded-none',
            'md:bg-[color-mix(in_srgb,var(--background)_35%,transparent)] md:bg-clip-padding md:backdrop-blur-lg',
          ].join(' ')}
          aria-label="Back to top"
          onClick={() => {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
          }}
        >
          <span
            id="progress-indicator"
            className="absolute inset-0 -z-10 block size-14 scale-110 rounded-full bg-transparent md:hidden md:h-8 md:rounded-md"
            style={progressStyle}
          />
          <ArrowLeftIcon className="inline-block rotate-90 md:hidden" />
          <span className="sr-only text-sm group-hover:text-[var(--accent)] md:not-sr-only">
            <ArrowNarrowUpIcon className="inline-block size-4" />
            Back to top
          </span>
        </button>
      </div>
    </>
  )
}
