'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import RememberBackUrl from '@/components/RememberBackUrl'
import PostTitleTransition from '@/components/PostTitleTransition'
import { IconArrowLeft, IconArrowRight, IconCalendar } from '@/components/icons/AstroPaperIcons'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}


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
          <IconArrowLeft className="inline-block size-5" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex select-none items-center gap-1 opacity-50"><IconArrowLeft className="inline-block size-5" />
          Previous</span>
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
          <IconArrowRight className="inline-block size-5" />
        </Link>
      ) : (
        <span className="inline-flex select-none items-center gap-1 opacity-50">Next
          <IconArrowRight className="inline-block size-5" /></span>
      )}
    </nav>
  )
}

function PostListItem({ post }: { post: CoreContent<Blog> }) {
  const { date, path, slug, summary, title } = post
  const href = path ? `/${path}` : `/blog/${slug}`

  return (
    <li className="my-6">
      <article>
        <Link
          href={href}
          className="inline-block text-lg font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
        >
          <PostTitleTransition title={title}>
            <h2>{title}</h2>
          </PostTitleTransition>
        </Link>

        <dl className="mt-1">
          <dt className="sr-only">Published on</dt>
          <dd className="flex items-center gap-x-2 text-sm text-[var(--muted-foreground)]">
            <IconCalendar className="inline-block size-5 min-w-5" />
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </dd>
        </dl>

        {summary && <p>{summary}</p>}
      </article>
    </li>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')

  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = `${post.title} ${post.summary ?? ''} ${post.tags?.join(' ') ?? ''}`
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <RememberBackUrl />
      <main id="main-content" className="app-layout pb-4">
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>

          <div className="relative mt-6 max-w-lg">
            <input
              aria-label="Search articles"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="block w-full rounded border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <svg
              className="absolute top-3 right-3 size-5 text-[var(--muted-foreground)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>

        <ul>
          {!displayPosts.length && 'No posts found.'}
          {displayPosts.map((post) => (
            <PostListItem key={post.path ?? post.slug} post={post} />
          ))}
        </ul>
      </main>

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
