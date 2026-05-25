'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

type GiscusConfig = {
  provider?: string
  giscusConfig?: {
    theme?: string
    darkTheme?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

const commentsConfig = siteMetadata.comments as GiscusConfig | undefined

function getGiscusTheme(resolvedTheme?: string) {
  const giscusConfig = commentsConfig?.giscusConfig

  if (resolvedTheme === 'dark') {
    return giscusConfig?.darkTheme || 'transparent_dark'
  }

  return giscusConfig?.theme || 'light'
}

function updateGiscusTheme(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')

  if (!iframe?.contentWindow) return

  iframe.contentWindow.postMessage(
    {
      giscus: {
        setConfig: {
          theme,
        },
      },
    },
    'https://giscus.app'
  )
}

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const { resolvedTheme } = useTheme()

  const resolvedCommentsConfig = useMemo(() => {
    if (!commentsConfig) return commentsConfig

    return {
      ...commentsConfig,
      giscusConfig: {
        ...commentsConfig.giscusConfig,
        theme: getGiscusTheme(resolvedTheme),
      },
    }
  }, [resolvedTheme])

  useEffect(() => {
    if (!loadComments) return

    updateGiscusTheme(getGiscusTheme(resolvedTheme))
  }, [loadComments, resolvedTheme])

  if (!commentsConfig?.provider) {
    return null
  }

  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={resolvedCommentsConfig} slug={slug} />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
