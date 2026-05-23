import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="inline-block text-2xl font-bold text-[var(--accent)] sm:text-3xl">
      {children}
    </h1>
  )
}
