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
    <div>
      <label className="sr-only" htmlFor="search-input">
        Search
      </label>

      <div className="relative">
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Search"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] py-3 pr-12 pl-4 font-normal text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-1 focus:outline-[var(--accent)] focus:ring-0"
        />
        <IconSearch className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" />
      </div>

      {!loaded && <p className="mt-6 text-[var(--muted-foreground)]">Loading search index...</p>}

      {loaded && !query && (
        <p className="mt-6 text-[var(--muted-foreground)]">
          Enter a keyword to search posts.
        </p>
      )}

      {loaded && query && results.length === 0 && (
        <p className="mt-6 text-[var(--muted-foreground)]">No results found.</p>
      )}

      {results.length > 0 && (
        <ul className="mt-8">
          {results.map((result) => {
            const href = result.path ? `/${result.path}` : `/blog/${result.slug}`
            const key = result.path ?? result.slug ?? result.title ?? href

            return (
              <li key={key} className="my-6">
                <article>
                  <Link
                    href={href}
                    className="inline-block text-lg font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:decoration-dashed focus-visible:no-underline focus-visible:underline-offset-0"
                  >
                    <PostTitleTransition title={result.title}>
                      <h2>{result.title}</h2>
                    </PostTitleTransition>
                  </Link>

                  {result.summary && <p>{result.summary}</p>}
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
