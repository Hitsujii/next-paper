import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <main id="main-content" className="app-layout pb-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">About</h1>
        <p className="mt-2 mb-6 italic">A bit about this template and its author profile.</p>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <aside className="flex shrink-0 flex-col items-center sm:w-48">
            {avatar && (
              <Image
                src={avatar}
                alt={name}
                width={192}
                height={192}
                className="size-36 rounded-full border border-[var(--border)] object-cover sm:size-40"
              />
            )}

            <h2 className="pt-4 pb-2 text-xl font-semibold">{name}</h2>

            {occupation && (
              <div className="text-center text-sm text-[var(--muted-foreground)]">
                {occupation}
              </div>
            )}
            {company && (
              <div className="text-center text-sm text-[var(--muted-foreground)]">
                {company}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-1 pt-4">
              <SocialIcon kind="mail" href={email ? `mailto:${email}` : undefined} size={24} />
              <SocialIcon kind="github" href={github} size={24} />
              <SocialIcon kind="linkedin" href={linkedin} size={24} />
              <SocialIcon kind="x" href={twitter} size={24} />
              <SocialIcon kind="bluesky" href={bluesky} size={24} />
            </div>
          </aside>

          <article className="post-content prose max-w-none dark:prose-invert sm:min-w-0">
            {children}
          </article>
        </div>
      </div>
    </main>
  )
}
