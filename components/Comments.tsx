'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

function getGiscusTheme(resolvedTheme?: string) {
  const giscusConfig = siteMetadata.comments?.giscusConfig

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

  const commentsConfig = useMemo(() => {
    if (!siteMetadata.comments) return siteMetadata.comments

    return {
      ...siteMetadata.comments,
      giscusConfig: {
        ...siteMetadata.comments.giscusConfig,
        theme: getGiscusTheme(resolvedTheme),
      },
    }
  }, [resolvedTheme])

  useEffect(() => {
    if (!loadComments) return

    updateGiscusTheme(getGiscusTheme(resolvedTheme))
  }, [loadComments, resolvedTheme])

  if (!siteMetadata.comments?.provider) {
    return null
  }

  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={commentsConfig} slug={slug} />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
