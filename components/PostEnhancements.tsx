'use client'

import { useEffect } from 'react'

type TocItem = {
  value?: string
  url?: string
  depth?: number
}

type PostEnhancementsProps = {
  toc?: TocItem[]
  hasToc?: boolean
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function headingText(heading: Element) {
  const clone = heading.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.heading-link').forEach((link) => link.remove())
  return clone.textContent?.trim() ?? ''
}

function normalizeTocHref(url: string | undefined, value: string | undefined) {
  if (url) return url.startsWith('#') ? url : `#${url}`
  return `#${slugifyHeading(value ?? '')}`
}

function codeText(pre: HTMLPreElement) {
  const clone = pre.cloneNode(true) as HTMLPreElement
  clone.querySelectorAll('button.copy-code').forEach((button) => button.remove())
  clone.querySelectorAll('.code-file-name').forEach((label) => label.remove())
  return clone.innerText.trimEnd()
}

function extractFileNameFromMeta(meta: string | null | undefined) {
  if (!meta) return undefined

  const match = meta.match(/(?:^|\s)file=(?:"([^"]+)"|'([^']+)'|([^\s]+))/)
  return match?.[1] ?? match?.[2] ?? match?.[3]
}

function readPreviousFileLabel(pre: HTMLPreElement) {
  const previous = pre.previousElementSibling as HTMLElement | null
  if (!previous) return undefined

  const text = previous.textContent?.trim() ?? ''
  const className = previous.getAttribute('class') ?? ''

  if (/rehype-code-title|code-title|filename|file-name/.test(className) && text) {
    return { fileName: text, element: previous }
  }

  const match = text.match(/^file:\s*(.+)$/i)

  if (match?.[1]) {
    return { fileName: match[1].trim(), element: previous }
  }

  return undefined
}

function enhanceTableOfContents(article: HTMLElement, toc: TocItem[], hasToc: boolean) {
  if (!hasToc || !toc.length) return

  const tocHeading = Array.from(article.querySelectorAll('h2')).find(
    (heading) => headingText(heading).toLowerCase() === 'table of contents'
  ) as HTMLElement | undefined

  if (!tocHeading || tocHeading.dataset.tocEnhanced === 'true') return

  const details = document.createElement('details')
  details.className = 'astro-toc'
  details.dataset.tocEnhanced = 'true'

  const summary = document.createElement('summary')
  summary.textContent = 'Table of contents'
  details.appendChild(summary)

  const nav = document.createElement('nav')
  nav.setAttribute('aria-label', 'Table of contents')

  const list = document.createElement('ul')

  toc
    .filter((item) => item.value && item.value.toLowerCase() !== 'table of contents')
    .forEach((item) => {
      const li = document.createElement('li')
      li.style.marginInlineStart = `${Math.max((item.depth ?? 2) - 2, 0)}rem`

      const link = document.createElement('a')
      link.href = normalizeTocHref(item.url, item.value)
      link.textContent = item.value ?? ''

      li.appendChild(link)
      list.appendChild(li)
    })

  nav.appendChild(list)
  details.appendChild(nav)

  let next = tocHeading.nextElementSibling as HTMLElement | null

  if (next && ['UL', 'OL'].includes(next.tagName)) {
    const toRemove = next
    next = next.nextElementSibling as HTMLElement | null
    toRemove.remove()
  }

  tocHeading.replaceWith(details)
}

function enhanceHeadings(article: HTMLElement) {
  const headings = Array.from(article.querySelectorAll('h2, h3, h4, h5, h6'))

  for (const heading of headings) {
    if (!(heading instanceof HTMLElement)) continue
    if (heading.dataset.headingEnhanced === 'true') continue
    if (heading.closest('.astro-toc')) continue

    if (!heading.id) {
      const id = slugifyHeading(headingText(heading))
      if (id) heading.id = id
    }

    if (!heading.id) continue

    heading.classList.add('group')
    heading.dataset.headingEnhanced = 'true'

    const link = document.createElement('a')
    link.className = 'heading-link'
    link.href = `#${heading.id}`
    link.setAttribute('aria-label', `Link to ${headingText(heading)}`)

    const span = document.createElement('span')
    span.ariaHidden = 'true'
    span.innerText = '#'

    link.appendChild(span)
    heading.appendChild(link)
  }
}

function enhanceCodeBlocks(article: HTMLElement) {
  const codeBlocks = Array.from(article.querySelectorAll('pre'))

  for (const codeBlock of codeBlocks) {
    if (!(codeBlock instanceof HTMLPreElement)) continue
    if (codeBlock.dataset.copyEnhanced === 'true') continue
    if (codeBlock.closest('.code-block-wrapper')) continue

    const code = codeBlock.querySelector('code') as HTMLElement | null
    const previousFileLabel = readPreviousFileLabel(codeBlock)

    const fileName =
      codeBlock.dataset.file ||
      code?.dataset.file ||
      extractFileNameFromMeta(codeBlock.dataset.meta) ||
      extractFileNameFromMeta(code?.dataset.meta) ||
      previousFileLabel?.fileName

    codeBlock.dataset.copyEnhanced = 'true'
    codeBlock.setAttribute('tabindex', '0')

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'

    if (fileName) {
      wrapper.dataset.file = fileName
    }

    const parent = codeBlock.parentNode

    if (!parent) continue

    if (previousFileLabel?.element) {
      previousFileLabel.element.remove()
    }

    parent.insertBefore(wrapper, codeBlock)

    if (fileName) {
      const fileLabel = document.createElement('div')
      fileLabel.className = 'code-file-name'
      fileLabel.textContent = fileName
      wrapper.appendChild(fileLabel)
    }

    wrapper.appendChild(codeBlock)

    const copyButton = document.createElement('button')
    copyButton.type = 'button'
    copyButton.className = 'copy-code'
    copyButton.innerHTML = 'Copy'

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeText(codeBlock))
        copyButton.innerHTML = 'Copied!'
        window.setTimeout(() => {
          copyButton.innerHTML = 'Copy'
        }, 1600)
      } catch {
        copyButton.innerHTML = 'Error'
        window.setTimeout(() => {
          copyButton.innerHTML = 'Copy'
        }, 1600)
      }
    })

    wrapper.appendChild(copyButton)
  }
}

export default function PostEnhancements({ toc = [], hasToc = false }: PostEnhancementsProps) {
  useEffect(() => {
    const article = document.getElementById('article')
    if (!article) return

    enhanceTableOfContents(article, Array.isArray(toc) ? toc : [], hasToc)
    enhanceHeadings(article)
    enhanceCodeBlocks(article)
  }, [toc, hasToc])

  return null
}
