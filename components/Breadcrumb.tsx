'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'

const labels: Record<string, string> = {
  blog: 'posts',
  posts: 'posts',
  tags: 'tags',
  about: 'about',
  projects: 'projects',
  search: 'search',
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function formatSegment(segment: string) {
  const decoded = safeDecode(segment)
  return labels[decoded] ?? decoded.replaceAll('-', ' ')
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const visibleSegments =
    segments[0] === 'blog' && segments[1] === 'page'
      ? ['posts']
      : segments[0] === 'tags' && segments[2] === 'page'
        ? ['tags', segments[1]]
        : segments

  return (
    <nav className="app-layout mt-8 mb-1" aria-label="breadcrumb">
      <ul className="font-light [&>li]:inline">
        <li>
          <Link href="/" className="opacity-80 hover:opacity-100">
            Home
          </Link>
          <span aria-hidden="true" className="opacity-80">
            &raquo;
          </span>
        </li>

        {visibleSegments.map((segment, index) => {
          const isLast = index === visibleSegments.length - 1
          const href =
            segment === 'posts'
              ? '/blog'
              : `/${segments.slice(0, index + 1).join('/')}`

          return (
            <li key={`${segment}-${index}`}>
              {isLast ? (
                <span className="lowercase opacity-75" aria-current="page">
                  {formatSegment(segment)}
                </span>
              ) : (
                <>
                  <Link href={href} className="lowercase opacity-70 hover:opacity-100">
                    {formatSegment(segment)}
                  </Link>
                  <span aria-hidden="true" className="opacity-70">
                    &raquo;
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
