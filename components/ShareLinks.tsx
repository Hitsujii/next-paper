import siteMetadata from '@/data/siteMetadata'

type ShareLinksProps = {
  path: string
  title: string
}

type IconProps = {
  className?: string
}

const XIcon = ({ className = '' }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4 4 16 16" />
    <path d="M20 4 4 20" />
  </svg>
)

const MailIcon = ({ className = '' }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

const TelegramIcon = ({ className = '' }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4 3 11.5l7 2.5L13.5 21 21 4Z" />
    <path d="m10 14 4-4" />
  </svg>
)

const PinterestIcon = ({ className = '' }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-1-5 1.5-9" />
    <path d="M10 14c-2.5-.5-4-2.5-4-5 0-3.5 2.8-6 6.2-6 3.5 0 5.8 2.2 5.8 5.4 0 3.3-1.8 5.8-4.4 5.8-1.3 0-2.2-.8-2-2" />
  </svg>
)

const FacebookIcon = ({ className = '' }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.5l.5-3h-3v-1.5c0-.8.2-1.5 1.5-1.5H17V8h-2Z" />
  </svg>
)

const WhatsAppIcon = ({ className = '' }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19.5 6.2 16A8 8 0 1 1 9 18.2L5 19.5Z" />
    <path d="M9.5 8.5c.3 2.6 2.2 4.5 5 5" />
    <path d="M9.5 8.5h1.4l.7 1.6-.8.8" />
    <path d="m14.5 13.5.8-.8 1.6.7v1.4" />
  </svg>
)

const sharePlatforms = [
  {
    name: 'whatsapp',
    label: 'Share this post on WhatsApp',
    icon: WhatsAppIcon,
    getHref: (url: string, title: string) => `https://wa.me/?text=${title}%20${url}`,
  },
  {
    name: 'facebook',
    label: 'Share this post on Facebook',
    icon: FacebookIcon,
    getHref: (url: string) => `https://www.facebook.com/sharer.php?u=${url}`,
  },
  {
    name: 'x',
    label: 'Share this post on X',
    icon: XIcon,
    getHref: (url: string, title: string) => `https://x.com/intent/post?url=${url}&text=${title}`,
  },
  {
    name: 'telegram',
    label: 'Share this post on Telegram',
    icon: TelegramIcon,
    getHref: (url: string, title: string) => `https://t.me/share/url?url=${url}&text=${title}`,
  },
  {
    name: 'pinterest',
    label: 'Share this post on Pinterest',
    icon: PinterestIcon,
    getHref: (url: string) => `https://pinterest.com/pin/create/button/?url=${url}`,
  },
  {
    name: 'mail',
    label: 'Share this post via email',
    icon: MailIcon,
    getHref: (url: string, title: string) => `mailto:?subject=${title}&body=${url}`,
  },
] as const

export default function ShareLinks({ path, title }: ShareLinksProps) {
  const pageUrl = `${siteMetadata.siteUrl}/${path}`.replace(/([^:]\/)\/+/, '$1')
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex flex-none flex-col items-center justify-center gap-1 md:items-start">
      <span className="italic">Share this post</span>

      <div className="text-center">
        {sharePlatforms.map(({ name, label, icon: Icon, getHref }) => (
          <a
            key={name}
            href={getHref(encodedUrl, encodedTitle)}
            className="group inline-flex scale-90 p-2 transition-transform hover:rotate-6 hover:text-[var(--accent)] sm:p-1"
            title={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent sm:scale-110" />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
