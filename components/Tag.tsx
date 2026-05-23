'use client'

import type { CSSProperties } from 'react'
import Link from '@/components/Link'
import { slug } from 'github-slugger'
import { tagViewTransitionName } from './view-transitions'

interface Props {
  text: string
  size?: 'sm' | 'lg'
  count?: number
  transition?: boolean
}

const HashIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="M5 9h14" />
    <path d="M5 15h14" />
    <path d="M11 4 7 20" />
    <path d="m17 4-4 16" />
  </svg>
)

const Tag = ({ text, size = 'sm', count, transition = false }: Props) => {
  const tagSlug = slug(text)
  const label = text.split(' ').join('-')
  const style = transition
    ? ({ viewTransitionName: tagViewTransitionName(text) } as CSSProperties)
    : undefined

  return (
    <Link
      href={`/tags/${tagSlug}`}
      style={style}
      className={[
        'inline-flex items-center gap-0.5 border-b-2 border-dashed border-[var(--foreground)]',
        'hover:-mt-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]',
        'focus-visible:border-transparent focus-visible:text-[var(--accent)]',
        size === 'lg' ? 'text-lg' : 'text-sm',
      ].join(' ')}
      aria-label={count ? `View ${count} posts tagged ${label}` : `View posts tagged ${label}`}
    >
      <HashIcon className={size === 'lg' ? 'size-5 opacity-80' : 'size-4 opacity-80'} />
      <span>{label}</span>
      {typeof count === 'number' && (
        <span className="ml-1 text-sm text-[var(--muted-foreground)]">({count})</span>
      )}
    </Link>
  )
}

export default Tag
