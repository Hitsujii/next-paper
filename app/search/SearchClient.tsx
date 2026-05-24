'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'
import PostTitleTransition from '@/components/PostTitleTransition'
import { IconSearch, IconX } from '@/components/icons/AstroPaperIcons'

type SearchDocument = {
  title?: string
  summary?: string
  path?: string
  slug?: string
  tags?: string[]
}

const normalize = (value: string) => value.toLowerCase().trim()

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
        className="pagefind-ui__form relative"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="search-input">
          Search posts...
        </label>

        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Search posts..."
          className="pagefind-ui__search-input w-full rounded border border-[var(--border)] bg-[var(--background)] py-3 pr-12 pl-12 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-0 focus:outline-1 focus:outline-[var(--accent)]"
        />

        <IconSearch className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" />

        {query && (
          <button
            type="button"
            className="focus-outline absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded hover:text-[var(--accent)]"
            aria-label="Clear search"
            onClick={() => setQuery('')}
          >
            <IconX className="size-5" />
          </button>
        )}
      </form>

      <div className="pagefind-ui__drawer mt-6">
        {!loaded && (
          <p className="pagefind-ui__message text-[var(--muted-foreground)]">
            Loading search index...
          </p>
        )}

        {loaded && !query && (
          <p className="pagefind-ui__message text-[var(--muted-foreground)]">
            Search posts...
          </p>
        )}

        {loaded && query && results.length === 0 && (
          <p className="pagefind-ui__message text-[var(--muted-foreground)]">
            No results found
          </p>
        )}

        {results.length > 0 && (
          <>
            <p className="pagefind-ui__message text-sm text-[var(--muted-foreground)]">
              {results.length} result{results.length === 1 ? '' : 's'} for{' '}
              <span className="text-[var(--foreground)]">{query}</span>
            </p>

            <ol className="pagefind-ui__results mt-4">
              {results.map((result) => {
                const href = result.path ? `/${result.path}` : `/blog/${result.slug}`
                const key = result.path ?? result.slug ?? result.title ?? href

                return (
                  <li key={key} className="pagefind-ui__result my-6">
                    <Link
                      href={href}
                      className="pagefind-ui__result-link inline-block text-lg font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
                    >
                      <PostTitleTransition title={result.title}>
                        <h2>{result.title}</h2>
                      </PostTitleTransition>
                    </Link>

                    {result.summary && (
                      <p className="pagefind-ui__result-excerpt">{result.summary}</p>
                    )}
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
