import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import BackButton from '@/components/BackButton'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ShareLinks from '@/components/ShareLinks'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import PostTitleTransition from '@/components/PostTitleTransition'

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
      {prev?.path ? (
        <Link
          href={`/${prev.path}`}
          className="group flex min-w-0 items-start gap-2 hover:opacity-75"
        >
          <ArrowLeftIcon className="mt-0.5 size-5 flex-none transition-transform group-hover:-translate-x-0.5" />
          <div className="min-w-0">
            <span className="block">Previous post</span>
            <div className="text-sm leading-6 text-[color-mix(in_srgb,var(--accent)_85%,transparent)]">
              <PostTitleTransition title={prev.title}>
                <span className="break-words">{prev.title}</span>
              </PostTitleTransition>
            </div>
          </div>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {next?.path && (
        <Link
          href={`/${next.path}`}
          className="group flex min-w-0 items-start justify-end gap-2 text-end hover:opacity-75 sm:col-start-2"
        >
          <div className="min-w-0">
            <span className="block">Next post</span>
            <div className="text-sm leading-6 text-[color-mix(in_srgb,var(--accent)_85%,transparent)]">
              <PostTitleTransition title={next.title}>
                <span className="break-words">{next.title}</span>
              </PostTitleTransition>
            </div>
          </div>
          <ArrowRightIcon className="mt-0.5 size-5 flex-none transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  )
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, lastmod, title, tags } = content
  const basePath = path?.split('/')[0] || 'blog'

  return (
    <>
      <ScrollTopAndComment />

      <div className="mt-8">
        <BackButton fallbackHref={`/${basePath}`} />
      </div>

      <main id="main-content" className="app-layout pb-4" data-pagefind-body>
        <article>
          <header>
            <PageTitle viewTransitionTitle={title}>{title}</PageTitle>
            <Datetime date={date} lastmod={lastmod} />

            {tags?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Tag text={tag} transition />
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="post-content prose max-w-none pt-8 pb-6 dark:prose-invert">
            {children}
          </div>

          <hr className="my-8 border-dashed border-[var(--border)]" />

          {tags?.length > 0 && (
            <ul className="mt-4 mb-8 flex flex-wrap gap-4 sm:my-8">
              {tags.map((tag) => (
                <li key={tag}>
                  <Tag text={tag} />
                </li>
              ))}
            </ul>
          )}

          <ShareLinks path={path} title={title} />

          <hr className="my-8 border-dashed border-[var(--border)]" />

          {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-[var(--muted-foreground)]" id="comment">
              <Comments slug={slug} />
            </div>
          )}

          <AdjacentPostNav prev={prev} next={next} />
        </article>
      </main>
    </>
  )
}
