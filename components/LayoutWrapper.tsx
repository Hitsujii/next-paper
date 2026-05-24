import { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

interface Props {
  children: ReactNode
}

export default function LayoutWrapper({ children }: Props) {
  return (
    <>
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </>
  )
}
