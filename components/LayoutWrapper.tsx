import { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'
import SectionContainer from './SectionContainer'

interface Props {
  children: ReactNode
}

export default function LayoutWrapper({ children }: Props) {
  return (
    <>
      <Header />
      <SectionContainer>{children}</SectionContainer>
      <Footer />
    </>
  )
}
