const basePath = process.env.BASE_PATH || ''

export function addBasePath(path: string) {
  if (!basePath || !path.startsWith('/') || path === basePath || path.startsWith(`${basePath}/`)) {
    return path
  }

  return `${basePath}${path}`
}

export function stripBasePath(path: string) {
  if (!basePath) return path
  if (path === basePath) return '/'
  if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length) || '/'
  return path
}

export function normalizeAppPath(path: string) {
  const withoutBase = stripBasePath(path)
  return withoutBase === '' ? '/' : withoutBase
}
