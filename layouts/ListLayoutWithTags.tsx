'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import RememberBackUrl from '@/components/RememberBackUrl'
import PostTitleTransition from '@/components/PostTitleTransition'

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
          className="select-none hover:text-[var(--accent)]"
        >
          ← Previous
        </Link>
      ) : (
        <span className="opacity-50 select-none">← Previous</span>
      )}

      <span>
        {currentPage} / {totalPages}
      </span>

      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="select-none hover:text-[var(--accent)]"
        >
          Next →
        </Link>
      ) : (
        <span className="opacity-50 select-none">Next →</span>
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
            <CalendarIcon className="inline-block size-5 min-w-5" />
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </dd>
        </dl>

        {summary && <p>{summary}</p>}
      </article>
    </li>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  const currentTag = decodeURI(pathname.split('/tags/')[1]?.split('/')[0] ?? '')

  return (
    <>
      <RememberBackUrl />
      <main id="main-content" className="pb-4">
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>

          <nav aria-label="Tags" className="mt-6">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              <li>
                {pathname.startsWith('/blog') ? (
                  <span className="font-medium text-[var(--accent)]">All Posts</span>
                ) : (
                  <Link href="/blog" className="font-medium hover:text-[var(--accent)]">
                    All Posts
                  </Link>
                )}
              </li>

              {sortedTags.map((tag) => {
                const tagSlug = slug(tag)
                const isActive = currentTag === tagSlug

                return (
                  <li key={tag}>
                    {isActive ? (
                      <span className="font-medium text-[var(--accent)]">
                        #{tag}{' '}
                        <span className="text-sm text-[var(--muted-foreground)]">
                          ({tagCounts[tag]})
                        </span>
                      </span>
                    ) : (
                      <Link
                        href={`/tags/${tagSlug}`}
                        className="font-medium hover:text-[var(--accent)]"
                      >
                        #{tag}{' '}
                        <span className="text-sm text-[var(--muted-foreground)]">
                          ({tagCounts[tag]})
                        </span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

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
