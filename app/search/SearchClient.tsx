'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'
import PostTitleTransition from '@/components/PostTitleTransition'
import { IconSearch } from '@/components/icons/AstroPaperIcons'

type SearchDocument = {
  title?: string
  summary?: string
  path?: string
  slug?: string
  tags?: string[]
}

const normalize = (value: string) => value.toLowerCase().trim()

function highlightText(value: string, query: string) {
  const term = query.trim()
  if (!term) return value

  const index = value.toLowerCase().indexOf(term.toLowerCase())
  if (index === -1) return value

  return (
    <>
      {value.slice(0, index)}
      <mark>{value.slice(index, index + term.length)}</mark>
      {value.slice(index + term.length)}
    </>
  )
}

export default function SearchClient() {
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<SearchDocument[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setQuery(params.get('q') ?? '')

    fetch('/search.json')
      .then((response) => {
        if (!response.ok) throw new Error('Search index not found')
        return response.json()
      })
      .then((data: SearchDocument[]) => {
        setDocuments(Array.isArray(data) ? data : [])
      })
      .catch(() => setDocuments([]))
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    const search = params.toString()
    const nextUrl = search ? `/search?${search}` : '/search'
    window.history.replaceState(window.history.state, '', nextUrl)
    sessionStorage.setItem('backUrl', nextUrl)
  }, [query])

  const results = useMemo(() => {
    const term = normalize(query)
    if (!term) return []

    return documents.filter((document) => {
      const haystack = normalize(
        [
          document.title,
          document.summary,
          document.path,
          document.slug,
          ...(document.tags ?? []),
        ]
          .filter(Boolean)
          .join(' ')
      )

      return haystack.includes(term)
    })
  }, [documents, query])

  return (
    <div id="pagefind-search" data-backurl="/search">
      <form
        className="pagefind-ui__form relative mt-6"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="search-input">
          Search posts...
        </label>

        <IconSearch className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" />

        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Search posts..."
          className="pagefind-ui__search-input w-full rounded-md border border-[var(--accent)] bg-[var(--background)] py-3 pr-20 pl-12 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-0 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            className="pagefind-ui__search-clear focus-outline absolute top-1/2 right-4 -translate-y-1/2 rounded px-1 text-sm hover:text-[var(--accent)]"
            aria-label="Clear search"
            onClick={() => setQuery('')}
          >
            Clear
          </button>
        )}
      </form>

      <div className="pagefind-ui__drawer mt-6">
        {!loaded && (
          <p className="pagefind-ui__message font-bold text-[var(--foreground)]">
            Loading search index...
          </p>
        )}

        {loaded && !query && (
          <p className="pagefind-ui__message text-[var(--muted-foreground)]">
            Search posts...
          </p>
        )}

        {loaded && query && results.length === 0 && (
          <p className="pagefind-ui__message font-bold text-[var(--foreground)]">
            No results found
          </p>
        )}

        {results.length > 0 && (
          <>
            <p className="pagefind-ui__message font-bold text-[var(--foreground)]">
              {results.length} result{results.length === 1 ? '' : 's'} for {query}
            </p>

            <ol className="pagefind-ui__results mt-6 border-t border-[var(--border)]">
              {results.map((result) => {
                const href = result.path ? `/${result.path}` : `/blog/${result.slug}`
                const key = result.path ?? result.slug ?? result.title ?? href
                const title = result.title ?? href
                const summary = result.summary ?? ''

                return (
                  <li
                    key={key}
                    className="pagefind-ui__result border-b border-[var(--border)] py-6"
                  >
                    <Link
                      href={href}
                      className="pagefind-ui__result-link inline-block text-xl font-bold text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
                    >
                      <PostTitleTransition title={title}>
                        <h2>{highlightText(title, query)}</h2>
                      </PostTitleTransition>
                    </Link>

                    {summary && (
                      <p className="pagefind-ui__result-excerpt mt-4 text-sm leading-7 sm:text-base">
                        {highlightText(summary, query)}
                      </p>
                    )}

                    {result.tags?.length ? (
                      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                        {result.tags.slice(0, 4).map((tag) => (
                          <li key={tag} className="text-sm text-[var(--muted-foreground)]">
                            ↳ {highlightText(tag, query)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}
