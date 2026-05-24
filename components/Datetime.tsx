import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { IconCalendar } from './icons/AstroPaperIcons'

type DatetimeProps = {
  date: string
  lastmod?: string | null
  size?: 'sm' | 'lg'
  className?: string
}

export default function Datetime({ date, lastmod, size = 'sm', className = '' }: DatetimeProps) {
  const isModified = Boolean(lastmod && lastmod > date)
  const displayDate = isModified ? lastmod || date : date

  return (
    <div
      className={[
        'flex items-center gap-x-2 text-[var(--muted-foreground)]',
        className,
      ].join(' ')}
    >
      <IconCalendar
        className={[
          'inline-block size-6 min-w-5.5',
          size === 'sm' ? 'scale-90' : '',
        ].join(' ')}
      />
      {isModified && (
        <span className={['text-sm', size === 'lg' ? 'sm:text-base' : ''].join(' ')}>
          Updated:
        </span>
      )}
      <time
        className={['text-sm', size === 'lg' ? 'sm:text-base' : ''].join(' ')}
        dateTime={displayDate}
      >
        {formatDate(displayDate, siteMetadata.locale)}
      </time>
    </div>
  )
}
