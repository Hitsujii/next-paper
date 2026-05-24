'use client'

import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Breadcrumb from '@/components/Breadcrumb'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import RememberBackUrl from '@/components/RememberBackUrl'
import PostTitleTransition from '@/components/PostTitleTransition'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  description?: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

const CalendarIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

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

const ArrowRightIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')

  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav
      className="mt-auto mb-8 flex justify-center gap-4"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="inline-flex select-none items-center gap-1 hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="inline-block size-5" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex select-none items-center gap-1 opacity-50">
          <ArrowLeftIcon className="inline-block size-5" />
          Previous
        </span>
      )}

      <span>
        {currentPage} / {totalPages}
      </span>

      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="inline-flex select-none items-center gap-1 hover:text-[var(--accent)]"
        >
          Next
          <ArrowRightIcon className="inline-block size-5" />
        </Link>
      ) : (
        <span className="inline-flex select-none items-center gap-1 opacity-50">
          Next
          <ArrowRightIcon className="inline-block size-5" />
        </span>
      )}
    </nav>
  )
}

function PostListItem({ post }: { post: CoreContent<Blog> }) {
  const { date, lastmod, path, slug, summary, title } = post
  const href = path ? `/${path}` : `/blog/${slug}`
  const isModified = Boolean(lastmod && lastmod > date)
  const displayDate = isModified ? lastmod : date

  return (
    <li className="my-6">
      <Link
        href={href}
        className="inline-block text-lg font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
      >
        <PostTitleTransition title={title}>
          <h2>{title}</h2>
        </PostTitleTransition>
      </Link>

      <dl className="mt-1">
        <dt className="sr-only">{isModified ? 'Updated on' : 'Published on'}</dt>
        <dd className="flex items-center gap-x-2 text-sm text-[var(--muted-foreground)]">
          <CalendarIcon className="inline-block size-6 min-w-5.5 scale-90" />
          {isModified && <span>Updated:</span>}
          <time dateTime={displayDate}>{formatDate(displayDate, siteMetadata.locale)}</time>
        </dd>
      </dl>

      {summary && <p>{summary}</p>}
    </li>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  description,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <RememberBackUrl />
      <Breadcrumb />

      <main id="main-content" className="app-layout pb-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 mb-6 italic">{description}</p>}

        <ul>
          {!displayPosts.length && 'No posts found.'}
          {displayPosts.map((post) => (
            <PostListItem key={post.path ?? post.slug} post={post} />
          ))}
        </ul>
      </main>

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
