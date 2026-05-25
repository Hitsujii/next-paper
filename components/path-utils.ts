const configuredBasePath = (
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.BASE_PATH ||
  ''
).replace(/\/$/, '')

function getOrigin() {
  return typeof window === 'undefined' ? 'https://nextpaper.local' : window.location.origin
}

function fallbackBasePath() {
  if (configuredBasePath) return configuredBasePath

  if (typeof window === 'undefined') return ''

  // GitHub Pages project site fallback.
  // Example:
  // https://hitsujii.github.io/next-paper/blog/code-sample
  // logical app path should be /blog/code-sample
  if (window.location.hostname.endsWith('github.io')) {
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0]
    return firstSegment ? `/${firstSegment}` : ''
  }

  return ''
}

export function stripBasePath(path: string) {
  const basePath = fallbackBasePath()
  if (!basePath) return path || '/'

  let nextPath = path || '/'

  while (nextPath === basePath || nextPath.startsWith(`${basePath}/`)) {
    nextPath = nextPath === basePath ? '/' : nextPath.slice(basePath.length) || '/'
  }

  return nextPath || '/'
}

export function normalizeAppPath(value: string) {
  if (!value) return '/'

  try {
    const origin = getOrigin()
    const parsed = new URL(value, origin)

    if (/^[a-z][a-z\d+\-.]*:/i.test(value) && parsed.origin !== origin) {
      return value
    }

    return `${stripBasePath(parsed.pathname)}${parsed.search}${parsed.hash}`
  } catch {
    return stripBasePath(value)
  }
}
