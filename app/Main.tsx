import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 4

export default function Home({ posts }) {
  return (
    <>
      <section className="border-b border-gray-200 pt-8 pb-6 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h1 className="my-4 text-4xl font-bold tracking-tight text-gray-900 sm:my-8 sm:text-5xl dark:text-gray-100">
            {siteMetadata.title}
          </h1>
          <Link
            href="/feed.xml"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="RSS Feed"
          >
            RSS
          </Link>
        </div>
        <div className="max-w-2xl space-y-3 text-gray-600 dark:text-gray-300">
          <p>{siteMetadata.description}</p>
          <p>
            A public Next.js blog template inspired by AstroPaper. It keeps the Tailwind Nextjs
            Starter Blog stack: MDX, Contentlayer, tags, RSS, sitemap and SEO.
          </p>
        </div>
      </section>

      <section className="pt-12 pb-6">
        <h2 className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Recent posts
        </h2>
        <ul>
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="my-6">
                <article>
                  <h3 className="text-lg font-medium">
                    <Link
                      href={`/blog/${slug}`}
                      className="text-primary-500 underline decoration-dashed underline-offset-4 hover:text-primary-600 hover:no-underline dark:hover:text-primary-400"
                    >
                      {title}
                    </Link>
                  </h3>
                  <dl className="mt-1">
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  {summary && <p className="mt-2 text-gray-600 dark:text-gray-300">{summary}</p>}
                  {tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  )}
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      {posts.length > MAX_DISPLAY && (
        <div className="my-8 text-center text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All posts &rarr;
          </Link>
        </div>
      )}

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
