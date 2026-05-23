import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function TableWrapper({ children }: Props) {
  return (
    <div className="overflow-hidden">
      <div className="relative w-full overflow-x-auto">{children}</div>
    </div>
  )
}
