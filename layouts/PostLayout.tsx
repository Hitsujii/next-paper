import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import BackButton from '@/components/BackButton'
import EditPost from '@/components/EditPost'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ShareLinks from '@/components/ShareLinks'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import BackToTopButton from '@/components/BackToTopButton'
import PostTitleTransition from '@/components/PostTitleTransition'
import { IconArrowLeft, IconArrowRight, IconCalendar } from '@/components/icons/AstroPaperIcons'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails?: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}




function Datetime({ date, lastmod }: { date: string; lastmod?: string }) {
  const isModified = Boolean(lastmod && lastmod > date)
  const displayDate = isModified ? lastmod : date

  return (
    <div className="flex items-center gap-x-2 text-sm text-[var(--muted-foreground)] sm:text-base">
      <IconCalendar className="inline-block size-6 min-w-5.5" />
      {isModified && <span>Updated:</span>}
      <time dateTime={displayDate}>{formatDate(displayDate, siteMetadata.locale)}</time>
    </div>
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
          <IconArrowLeft className="mt-0.5 size-5 flex-none transition-transform group-hover:-translate-x-0.5" />
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
          <IconArrowRight className="mt-0.5 size-5 flex-none transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  )
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, date, lastmod, title, tags } = content
  const basePath = path?.split('/')[0] || 'blog'

  return (
    <>
      <div className="app-layout flex items-center justify-start">
        <BackButton fallbackHref={`/${basePath}`} />
      </div>

      <main id="main-content" className="app-layout pb-4" data-pagefind-body>
        <h1 className="inline-block text-2xl font-bold text-[var(--accent)] sm:text-3xl">
          <PageTitle viewTransitionTitle={title} asChild>
            {title}
          </PageTitle>
        </h1>

        <div className="my-2 flex items-center gap-2">
          <Datetime date={date} lastmod={lastmod} />
          <span aria-hidden="true" className="text-[var(--muted-foreground)] max-sm:hidden">
            |
          </span>
          <EditPost path={path} className="max-sm:hidden" />
        </div>

        <article
          id="article"
          className="post-content prose mt-8 w-full max-w-none dark:prose-invert"
        >
          {children}
        </article>

        <hr className="my-8 border-dashed border-[var(--border)]" />

        <EditPost path={path} className="sm:hidden" />

        <BackToTopButton />

        {tags?.length > 0 && (
          <ul className="mt-4 mb-8 flex flex-wrap gap-4 sm:my-8">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag text={tag} size="sm" />
              </li>
            ))}
          </ul>
        )}

        <ShareLinks path={path} title={title} />

        <hr className="my-8 border-dashed border-[var(--border)]" />

        <AdjacentPostNav prev={prev} next={next} />
      </main>
    </>
  )
}
