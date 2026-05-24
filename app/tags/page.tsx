import Tag from '@/components/Tag'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Tags',
  description: 'All tags used across the blog',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <main id="main-content" className="app-layout pb-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Tags</h1>
        <p className="mt-2 mb-6 italic">All tags used in posts.</p>

        {sortedTags.length === 0 ? (
          <p>No tags found.</p>
        ) : (
          <ul className="flex flex-wrap gap-x-5 gap-y-4">
            {sortedTags.map((tag) => (
              <li key={tag}>
                <Tag text={tag} size="lg" count={tagCounts[tag]} transition />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
