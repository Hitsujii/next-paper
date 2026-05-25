'use client'

import { normalizeAppPath } from './path-utils'
import { useEffect } from 'react'

type RememberBackUrlProps = {
  value?: string
}

export default function RememberBackUrl({ value }: RememberBackUrlProps) {
  useEffect(() => {
    const backUrl = value || `${window.location.pathname}${window.location.search}`

    sessionStorage.setItem('backUrl', backUrl)
  }, [value])

  return null
}
