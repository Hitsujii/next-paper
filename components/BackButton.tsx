'use client'

import { useEffect, useState } from 'react'
import Link from './Link'

type BackButtonProps = {
  fallbackHref: string
}

const ChevronLeftIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export default function BackButton({ fallbackHref }: BackButtonProps) {
  const [href, setHref] = useState(fallbackHref)

  useEffect(() => {
    const storedBackUrl = sessionStorage.getItem('backUrl')

    if (storedBackUrl && storedBackUrl !== window.location.pathname) {
      setHref(storedBackUrl)
    }
  }, [fallbackHref])

  return (
    <Link
      id="back-button"
      href={href}
      className="focus-outline -ms-2 mt-8 mb-2 inline-flex items-center gap-1 hover:text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]"
      aria-label="Back"
    >
      <ChevronLeftIcon className="inline-block size-6" />
      <span>Back</span>
    </Link>
  )
}
