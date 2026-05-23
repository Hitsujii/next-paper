import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails?: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
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

function Datetime({ date, lastmod }: { date: string; lastmod?: string }) {
  const isModified = Boolean(lastmod && lastmod > date)
  const displayDate = isModified ? lastmod : date

  return (
    <dl className="mt-3">
      <dt className="sr-only">{isModified ? 'Updated on' : 'Published on'}</dt>
      <dd className="flex items-center gap-x-2 text-sm text-[var(--muted-foreground)] sm:text-base">
        <CalendarIcon className="inline-block size-6 min-w-5.5 scale-90" />
        {isModified && <span>Updated:</span>}
        <time dateTime={displayDate}>{formatDate(displayDate, siteMetadata.locale)}</time>
      </dd>
    </dl>
  )
}

function AdjacentPostNav({
  next,
  prev,
}: {
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}) {
  if (!next && !prev) return null

  return (
    <nav
      data-pagefind-ignore
      className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
      aria-label="Adjacent posts"
    >
      {prev?.path && (
        <Link href={`/${prev.path}`} className="flex w-full gap-1 hover:opacity-75">
          <ArrowLeftIcon className="inline-block flex-none" />
          <div>
            <span>Previous post</span>
            <div className="text-sm text-[color-mix(in_srgb,var(--accent)_85%,transparent)]">
              {prev.title}
            </div>
          </div>
        </Link>
      )}

      {next?.path && (
        <Link
          href={`/${next.path}`}
          className="flex w-full justify-end gap-1 text-end hover:opacity-75 sm:col-start-2"
        >
          <div>
            <span>Next post</span>
            <div className="text-sm text-[color-mix(in_srgb,var(--accent)_85%,transparent)]">
              {next.title}
            </div>
          </div>
          <ArrowRightIcon className="inline-block flex-none" />
        </Link>
      )}
    </nav>
  )
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, lastmod, title, tags } = content
  const basePath = path?.split('/')[0] || 'blog'

  return (
    <SectionContainer>
      <ScrollTopAndComment />

      <div className="mt-8">
        <Link
          href={`/${basePath}`}
          className="mb-6 inline-flex items-center gap-1 text-[var(--accent)] hover:opacity-75"
          aria-label="Back to the blog"
        >
          <ArrowLeftIcon className="size-5" />
          Back
        </Link>
      </div>

      <main id="main-content" className="pb-4" data-pagefind-body>
        <article>
          <header>
            <PageTitle>{title}</PageTitle>
            <Datetime date={date} lastmod={lastmod} />

            {tags?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </ul>
            )}
          </header>

          <div className="post-content prose max-w-none pt-8 pb-6 dark:prose-invert">
            {children}
          </div>

          {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-[var(--muted-foreground)]" id="comment">
              <Comments slug={slug} />
            </div>
          )}

          <AdjacentPostNav prev={prev} next={next} />
        </article>
      </main>
    </SectionContainer>
  )
}
