import Link from '@/components/Link'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import RememberBackUrl from '@/components/RememberBackUrl'
import PostTitleTransition from '@/components/PostTitleTransition'

const MAX_DISPLAY = 4

const socialLinks = [
  { kind: 'github', href: siteMetadata.github },
  { kind: 'x', href: siteMetadata.twitter || siteMetadata.x },
  { kind: 'linkedin', href: siteMetadata.linkedin },
  { kind: 'mail', href: siteMetadata.email ? `mailto:${siteMetadata.email}` : undefined },
] as const

const RssIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" />
  </svg>
)

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

function PostCard({ post, heading = 'h2' }) {
  const { date, lastmod, path, slug, summary, title } = post
  const href = path ? `/${path}` : `/blog/${slug}`
  const Heading = heading
  const isModified = Boolean(lastmod && lastmod > date)
  const displayDate = isModified ? lastmod : date

  return (
    <li className="my-6">
      <article>
        <Link
          href={href}
          className="inline-block text-lg font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
        >
          <PostTitleTransition title={title}>
            <Heading>{title}</Heading>
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
      </article>
    </li>
  )
}

function SectionTitle({ children }) {
  return <h2 className="mt-12 text-2xl font-semibold sm:text-3xl">{children}</h2>
}

export default function Home({ posts }) {
  const featuredPosts = posts.filter((post) => Boolean(post.featured)).slice(0, MAX_DISPLAY)
  const fallbackFeaturedPosts = featuredPosts.length > 0 ? featuredPosts : posts.slice(0, 3)
  const featuredPaths = new Set(fallbackFeaturedPosts.map((post) => post.path ?? post.slug))
  const recentPosts = posts
    .filter((post) => !featuredPaths.has(post.path ?? post.slug))
    .slice(0, MAX_DISPLAY)

  return (
    <>
      <RememberBackUrl />

      <main id="main-content" data-layout="index">
        <section id="hero" className="border-b border-[var(--border)] pt-8 pb-6">
          <h1 className="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">
            Mingalaba
          </h1>

          <Link href="/feed.xml" className="inline-block" aria-label="RSS Feed" title="RSS Feed">
            <RssIcon className="size-5 scale-125 stroke-[var(--accent)]" />
            <span className="sr-only">RSS Feed</span>
          </Link>

          <p>
            NextPaper is a minimal, responsive, accessible and SEO-friendly Next.js blog
            template. This template follows AstroPaper visual patterns while keeping the
            Tailwind Nextjs Starter Blog content pipeline.
          </p>

          <p className="mt-4">
            Read the blog posts or check{' '}
            <Link href="/about" className="underline decoration-dashed underline-offset-4">
              README
            </Link>{' '}
            for more info.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <span>Social Links:</span>
            <div className="flex flex-wrap items-center gap-1">
              {socialLinks.map(({ kind, href }) => (
                <SocialIcon key={kind} kind={kind} href={href} size={24} />
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="featured-posts">
          <SectionTitle>Featured</SectionTitle>
          <ul>
            {fallbackFeaturedPosts.map((post) => (
              <PostCard key={post.path ?? post.slug} post={post} heading="h3" />
            ))}
          </ul>
        </section>

        {recentPosts.length > 0 && (
          <section aria-labelledby="recent-posts" className="border-t border-[var(--border)] pt-6">
            <SectionTitle>Recent Posts</SectionTitle>
            <ul>
              {recentPosts.map((post) => (
                <PostCard key={post.path ?? post.slug} post={post} heading="h3" />
              ))}
            </ul>
          </section>
        )}

        {posts.length > MAX_DISPLAY && (
          <div className="my-8 flex justify-start">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:opacity-80"
              aria-label="All posts"
            >
              All Posts
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        )}
      </main>

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
