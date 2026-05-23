import Link from './Link'

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

const SearchButton = () => {
  return (
    <Link
      href="/search"
      className="focus-outline relative flex size-12 items-center justify-center p-4 hover:text-[var(--accent)] sm:size-8 sm:p-0"
      aria-label="Search"
      title="Search"
    >
      <SearchIcon className="size-6" />
      <span className="sr-only">Search</span>
    </Link>
  )
}

export default SearchButton
