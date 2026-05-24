import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import BackButton from '@/components/BackButton'
import BackToTopButton from '@/components/BackToTopButton'
import Datetime from '@/components/Datetime'
import EditPost from '@/components/EditPost'
import Link from '@/components/Link'
import ShareLinks from '@/components/ShareLinks'
import Tag from '@/components/Tag'
import PostTitleTransition from '@/components/PostTitleTransition'
import PostEnhancements from '@/components/PostEnhancements'
import { IconArrowLeft, IconArrowRight } from '@/components/icons/AstroPaperIcons'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails?: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
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
          className="group flex min-w-0 items-start gap-1 hover:opacity-75"
        >
          <IconArrowLeft className="mt-0.5 inline-block size-5 flex-none rtl:rotate-180" />
          <div className="min-w-0">
            <span className="block">Previous post</span>
            <div className="text-sm text-[var(--accent)]">
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
          className="group flex min-w-0 items-start justify-end gap-1 text-end hover:opacity-75 sm:col-start-2"
        >
          <div className="min-w-0">
            <span className="block">Next post</span>
            <div className="text-sm text-[var(--accent)]">
              <PostTitleTransition title={next.title}>
                <span className="break-words">{next.title}</span>
              </PostTitleTransition>
            </div>
          </div>
          <IconArrowRight className="mt-0.5 inline-block size-5 flex-none rtl:rotate-180" />
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
        <PostEnhancements />
        <h1 className="inline-block text-2xl font-bold text-[var(--accent)] sm:text-3xl">
          <PostTitleTransition title={title}>{title}</PostTitleTransition>
        </h1>

        <div className="my-2 flex items-center gap-2">
          <Datetime date={date} lastmod={lastmod} size="lg" />
          <span aria-hidden="true" className="text-[var(--muted-foreground)] max-sm:hidden">
            |
          </span>
          <EditPost path={path} className="max-sm:hidden" />
        </div>

        <article
          id="article"
          className="post-content app-prose prose mt-8 max-w-none dark:prose-invert"
        >
          {children}
        </article>

        <hr className="my-8 border-dashed" />

        <div className="clear-both">
          <EditPost path={path} className="sm:hidden" />
        </div>

        {tags?.length > 0 && (
          <ul className="mt-4 mb-8 flex flex-wrap gap-4 sm:my-8">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag text={tag} size="sm" />
              </li>
            ))}
          </ul>
        )}

        <div className="clear-both">
          <ShareLinks path={path} title={title} />
        </div>

        <hr className="my-8 border-dashed" />

        <AdjacentPostNav prev={prev} next={next} />
      </main>
    </>
  )
}
