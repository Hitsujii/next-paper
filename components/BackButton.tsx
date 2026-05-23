'use client'

import { useEffect, useState } from 'react'
import Link from './Link'

type BackButtonProps = {
  fallbackHref: string
}

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
      href={href}
      className="mb-6 inline-flex items-center gap-1 text-[var(--accent)] hover:opacity-75"
      aria-label="Back"
    >
      <ArrowLeftIcon className="size-5" />
      Back
    </Link>
  )
}
