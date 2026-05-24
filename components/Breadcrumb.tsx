'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'

const labels: Record<string, string> = {
  blog: 'Posts',
  posts: 'Posts',
  tags: 'Tags',
  about: 'About',
  projects: 'Projects',
  search: 'Search',
}

function decodeSegment(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function labelFor(segment: string) {
  const decoded = decodeSegment(segment)
  return labels[decoded] ?? decoded.replaceAll('-', ' ')
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbSegments =
    segments[0] === 'blog' && segments[1] === 'page'
      ? [`Posts (page ${segments[2] || 1})`]
      : segments[0] === 'tags' && segments[2] === 'page'
        ? ['tags', `${labelFor(segments[1])} ${Number(segments[3]) === 1 ? '' : `(page ${segments[3]})`}`.trim()]
        : segments

  return (
    <nav className="app-layout mt-8 mb-1" aria-label="breadcrumb">
      <ul className="font-light [&>li]:inline [&>li:not(:last-child)>a]:hover:opacity-100">
        <li>
          <Link href="/" className="opacity-80">
            Home
          </Link>
          <span aria-hidden="true" className="opacity-80">
            &raquo;
          </span>
        </li>

        {crumbSegments.map((segment, index) => {
          const isLast = index + 1 === crumbSegments.length
          const href = `/${segments.slice(0, index + 1).join('/')}`

          return (
            <li key={`${segment}-${index}`}>
              {isLast ? (
                <span
                  className={[
                    'capitalize opacity-75',
                    index > 0 ? 'lowercase' : '',
                  ].join(' ')}
                  aria-current="page"
                >
                  {labelFor(segment)}
                </span>
              ) : (
                <>
                  <Link href={href} className="capitalize opacity-70">
                    {labelFor(segment)}
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
