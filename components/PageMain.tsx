import type { ReactNode } from 'react'
import RememberBackUrl from './RememberBackUrl'

type PageMainProps = {
  title: string
  description?: string
  children: ReactNode
}

export default function PageMain({ title, description, children }: PageMainProps) {
  return (
    <>
      <RememberBackUrl />
      <main id="main-content" className="app-layout pb-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 mb-6 italic">{description}</p>}
        {children}
      </main>
    </>
  )
}
