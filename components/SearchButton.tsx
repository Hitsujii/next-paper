import Link from './Link'

type SearchButtonProps = {
  active?: boolean
}

const SearchIcon = ({ className = '' }: { className?: string }) => (
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
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </svg>
)

const UnderlineIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 8"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M2 6c4-4 8-4 12 0s6 0 8-2" />
  </svg>
)

const SearchButton = ({ active = false }: SearchButtonProps) => {
  return (
    <Link
      href="/search"
      className={[
        'focus-outline relative size-8 hover:text-[var(--accent)]',
        active ? 'text-[var(--accent)]' : '',
      ].join(' ')}
      aria-label="Search"
      title="Search"
    >
      <SearchIcon className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2" />
      <span className="sr-only">Search</span>
      {active && <UnderlineIcon className="absolute bottom-0 w-6 scale-125 max-sm:inset-x-2" />}
    </Link>
  )
}

export default SearchButton
