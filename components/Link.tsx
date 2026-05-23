'use client'

import NextLink, { type LinkProps } from 'next/link'
import { useRouter as useNextRouter } from 'next/navigation'
import { useTransitionRouter } from 'next-view-transitions'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | 'href'> & {
    children?: ReactNode
  }

let transitionLocked = false
let unlockTimer: ReturnType<typeof setTimeout> | undefined

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0
}

function formatHref(href: Props['href']) {
  if (typeof href === 'string') return href

  const pathname = href.pathname ?? ''
  const query = href.query
    ? `?${new URLSearchParams(
        Object.entries(href.query).reduce<Record<string, string>>((params, [key, value]) => {
          if (value !== null && value !== undefined) {
            params[key] = String(value)
          }
          return params
        }, {})
      ).toString()}`
    : ''
  const hash = href.hash ? `#${String(href.hash).replace(/^#/, '')}` : ''

  return `${pathname}${query === '?' ? '' : query}${hash}`
}

function isInternalHref(href: string) {
  if (href.startsWith('#')) return false
  if (href.startsWith('/')) return !href.startsWith('//')

  try {
    return new URL(href, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

function toRouterHref(href: string) {
  if (href.startsWith('/')) return href

  const url = new URL(href, window.location.href)
  return `${url.pathname}${url.search}${url.hash}`
}

function lockTransitions() {
  transitionLocked = true
  document.documentElement.dataset.viewTransition = 'running'

  if (unlockTimer) clearTimeout(unlockTimer)

  unlockTimer = setTimeout(() => {
    transitionLocked = false
    delete document.documentElement.dataset.viewTransition
  }, 900)
}

export default function Link({
  href,
  onClick,
  replace,
  scroll,
  target,
  download,
  children,
  ...rest
}: Props) {
  const transitionRouter = useTransitionRouter()
  const fallbackRouter = useNextRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      isModifiedEvent(event) ||
      target ||
      download ||
      typeof window === 'undefined'
    ) {
      return
    }

    const hrefString = formatHref(href)
    if (!isInternalHref(hrefString)) return

    const routerHref = toRouterHref(hrefString)
    const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (routerHref === currentHref) {
      event.preventDefault()
      return
    }

    event.preventDefault()

    if (transitionLocked) return

    lockTransitions()

    try {
      if (replace) {
        transitionRouter.replace(routerHref, { scroll })
      } else {
        transitionRouter.push(routerHref, { scroll })
      }
    } catch (error) {
      const name = error instanceof DOMException ? error.name : ''

      if (name !== 'AbortError' && name !== 'InvalidStateError') {
        throw error
      }

      if (replace) {
        fallbackRouter.replace(routerHref, { scroll })
      } else {
        fallbackRouter.push(routerHref, { scroll })
      }
    }
  }

  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      target={target}
      download={download}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
