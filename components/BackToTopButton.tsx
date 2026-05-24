'use client'

import { useEffect, useState } from 'react'
import { IconArrowNarrowUp } from './icons/AstroPaperIcons'

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
      setVisible(scrollTop > 320)
    }

    handleScroll()

    document.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      <button
        type="button"
        className={[
          'focus-outline fixed right-4 bottom-6 z-50 inline-flex items-center gap-1 rounded-md',
          'bg-[color-mix(in_srgb,var(--background)_80%,transparent)] px-3 py-2 text-sm',
          'text-[var(--foreground)] shadow-sm backdrop-blur-lg transition-all hover:text-[var(--accent)]',
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0',
        ].join(' ')}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IconArrowNarrowUp className="inline-block size-4" />
        Back to top
      </button>
    </>
  )
}
