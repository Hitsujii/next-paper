import {
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  X,
  Mastodon,
  Threads,
  Instagram,
  Medium,
  Bluesky,
} from './icons'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  medium: Medium,
  bluesky: Bluesky,
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

const SocialIcon = ({ kind, href, size = 24 }: SocialIconProps) => {
  if (
    !href ||
    (kind === 'mail' && !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  ) {
    return null
  }

  const SocialSvg = components[kind]
  const label = kind === 'mail' ? 'Send an email' : kind

  return (
    <a
      className="group inline-flex p-2 transition-transform hover:rotate-6 hover:text-[var(--accent)] sm:p-1"
      target={kind === 'mail' ? undefined : '_blank'}
      rel={kind === 'mail' ? undefined : 'noopener noreferrer'}
      href={href}
      title={label}
    >
      <span className="sr-only">{label}</span>
      <SocialSvg
        aria-hidden="true"
        className="fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent"
        style={{ width: size, height: size }}
      />
    </a>
  )
}

export default SocialIcon
