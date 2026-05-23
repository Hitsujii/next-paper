import Link from '@/components/Link'
import Tag from '@/components/Tag'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 4

const socialLinks = [
  { kind: 'github', href: siteMetadata.github },
  { kind: 'x', href: siteMetadata.twitter },
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
  const { date, path, slug, summary, tags, title } = post
  const href = path ? `/${path}` : `/blog/${slug}`
  const Heading = heading

  return (
    <li className="my-6">
      <article>
        <Link
          href={href}
          className="inline-block text-lg font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
        >
          <Heading>{title}</Heading>
        </Link>

        <dl className="mt-1">
          <dt className="sr-only">Published on</dt>
          <dd className="flex items-center gap-x-2 text-sm text-[var(--muted-foreground)]">
            <CalendarIcon className="inline-block size-5 min-w-5" />
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </dd>
        </dl>

        {summary && <p className="mt-2">{summary}</p>}

        {tags?.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag text={tag} />
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  )
}

function SectionTitle({ children }) {
  return <h2 className="mt-12 text-2xl font-semibold sm:text-3xl">{children}</h2>
}

export default function Home({ posts }) {
  const featuredPosts = posts.filter((post) => Boolean(post.featured)).slice(0, MAX_DISPLAY)
  const recentPosts = posts
    .filter((post) => !post.featured)
    .slice(0, featuredPosts.length > 0 ? MAX_DISPLAY : MAX_DISPLAY)

  return (
    <>
      <main id="main-content" data-layout="index">
        <section id="hero" className="border-b border-[var(--border)] pt-8 pb-6">
          <h1 className="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">
            {siteMetadata.title}
          </h1>

          <Link
            href="/feed.xml"
            className="inline-block"
            aria-label="RSS Feed"
            title="RSS Feed"
          >
            <RssIcon className="size-5 scale-125 stroke-[var(--accent)]" />
            <span className="sr-only">RSS Feed</span>
          </Link>

          <p>{siteMetadata.description}</p>

          <p className="mt-4">
            NextPaper is a minimal, responsive, accessible and SEO-friendly Next.js blog template.
            It keeps the Tailwind Nextjs Starter Blog content pipeline while matching the AstroPaper
            interface.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <span>Follow the project on</span>
            <div className="flex flex-wrap items-center gap-1">
              {socialLinks.map(({ kind, href }) => (
                <SocialIcon key={kind} kind={kind} href={href} size={24} />
              ))}
            </div>
          </div>
        </section>

        {featuredPosts.length > 0 && (
          <section aria-labelledby="featured-posts">
            <SectionTitle>Featured</SectionTitle>
            <ul>
              {featuredPosts.map((post) => (
                <PostCard key={post.path ?? post.slug} post={post} heading="h3" />
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="recent-posts">
          <SectionTitle>Recent Posts</SectionTitle>
          <ul>
            {!recentPosts.length && 'No posts found.'}
            {recentPosts.map((post) => (
              <PostCard key={post.path ?? post.slug} post={post} heading="h3" />
            ))}
          </ul>
        </section>

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
