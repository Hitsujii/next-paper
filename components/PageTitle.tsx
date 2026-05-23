import type { ReactNode } from 'react'
import PostTitleTransition from './PostTitleTransition'

interface Props {
  children: ReactNode
  viewTransitionTitle?: string
}

export default function PageTitle({ children, viewTransitionTitle }: Props) {
  const title = viewTransitionTitle ?? (typeof children === 'string' ? children : undefined)

  return (
    <PostTitleTransition title={title}>
      <h1 className="inline-block text-2xl font-bold text-[var(--accent)] sm:text-3xl">
        {children}
      </h1>
    </PostTitleTransition>
  )
}
