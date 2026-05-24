import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

type EditPostProps = {
  path: string
  className?: string
}

const EditIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

export default function EditPost({ path, className = '' }: EditPostProps) {
  if (!siteMetadata.siteRepo) return null

  const contentPath = path.endsWith('.md') || path.endsWith('.mdx') ? path : `data/${path}.mdx`
  const href = `${siteMetadata.siteRepo.replace(/\/$/, '')}/edit/main/${contentPath}`

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] sm:text-base',
        className,
      ].join(' ')}
      aria-label="Edit this post"
      title="Edit this post"
    >
      <EditIcon className="size-5" />
      <span>Edit</span>
    </Link>
  )
}
