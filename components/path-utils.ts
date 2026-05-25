const configuredBasePath = (
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.BASE_PATH ||
  ''
).replace(/\/$/, '')

function getOrigin() {
  return typeof window === 'undefined' ? 'https://nextpaper.local' : window.location.origin
}

export function stripBasePath(path: string) {
  if (!configuredBasePath) return path || '/'

  let nextPath = path || '/'

  while (nextPath === configuredBasePath || nextPath.startsWith(`${configuredBasePath}/`)) {
    nextPath =
      nextPath === configuredBasePath ? '/' : nextPath.slice(configuredBasePath.length) || '/'
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

// Keep this exported for older imports, but do not manually prefix NextLink hrefs.
// Next applies basePath itself.
export function addBasePath(path: string) {
  return path
}
