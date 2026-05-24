import RememberBackUrl from '@/components/RememberBackUrl'
import { genPageMetadata } from 'app/seo'
import SearchClient from './SearchClient'

export const metadata = genPageMetadata({
  title: 'Search',
  description: 'Search articles by title, summary and tag',
})

export default function SearchPage() {
  return (
    <>
      <RememberBackUrl />
      <main id="main-content" className="app-layout pb-4">
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">Search</h1>
          <p className="mt-2 mb-6 italic">Search articles by title, summary and tag.</p>
          <SearchClient />
        </div>
      </main>
    </>
  )
}
