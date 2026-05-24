'use client'

import { useEffect, useState } from 'react'
import Link from './Link'
import { IconChevronLeft } from './icons/AstroPaperIcons'

type BackButtonProps = {
  fallbackHref: string
}

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
      aria-label="Go back"
    >
      <IconChevronLeft className="inline-block size-6" />
      <span>Go back</span>
    </Link>
  )
}
