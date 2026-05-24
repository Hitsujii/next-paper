'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import PostCard from '@/components/PostCard'
import RememberBackUrl from '@/components/RememberBackUrl'
import { IconArrowLeft, IconArrowRight, IconSearch } from '@/components/icons/AstroPaperIcons'

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
          <IconArrowLeft className="inline-block size-5 rtl:rotate-180" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex select-none items-center gap-1 opacity-50">
          <IconArrowLeft className="inline-block size-5 rtl:rotate-180" />
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
          <IconArrowRight className="inline-block size-5 rtl:rotate-180" />
        </Link>
      ) : (
        <span className="inline-flex select-none items-center gap-1 opacity-50">
          Next
          <IconArrowRight className="inline-block size-5 rtl:rotate-180" />
        </span>
      )}
    </nav>
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
            <IconSearch className="absolute top-3 right-3 size-5 text-[var(--muted-foreground)]" />
          </div>
        </div>

        <ul>
          {!displayPosts.length && 'No posts found.'}
          {displayPosts.map((post) => (
            <PostCard key={post.path ?? post.slug} post={post} />
          ))}
        </ul>
      </main>

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
