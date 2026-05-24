'use client'

import { useEffect } from 'react'

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

function codeText(pre: HTMLPreElement) {
  const clone = pre.cloneNode(true) as HTMLPreElement
  clone.querySelectorAll('button.copy-code').forEach((button) => button.remove())
  return clone.innerText.trimEnd()
}

export default function PostEnhancements() {
  useEffect(() => {
    const article = document.getElementById('article')
    if (!article) return

    const headings = Array.from(article.querySelectorAll('h2, h3, h4, h5, h6'))

    for (const heading of headings) {
      if (!(heading instanceof HTMLElement)) continue
      if (heading.dataset.headingEnhanced === 'true') continue

      if (!heading.id) {
        const id = slugifyHeading(heading.textContent || '')
        if (id) heading.id = id
      }

      if (!heading.id) continue

      heading.classList.add('group')
      heading.dataset.headingEnhanced = 'true'

      const link = document.createElement('a')
      link.className =
        'heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100'
      link.href = `#${heading.id}`
      link.setAttribute('aria-label', `Link to ${heading.textContent || 'section'}`)

      const span = document.createElement('span')
      span.ariaHidden = 'true'
      span.innerText = '#'

      link.appendChild(span)
      heading.appendChild(link)
    }

    const codeBlocks = Array.from(article.querySelectorAll('pre'))

    for (const codeBlock of codeBlocks) {
      if (!(codeBlock instanceof HTMLPreElement)) continue
      if (codeBlock.dataset.copyEnhanced === 'true') continue

      codeBlock.dataset.copyEnhanced = 'true'
      codeBlock.setAttribute('tabindex', '0')

      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'

      codeBlock.parentNode?.insertBefore(wrapper, codeBlock)
      wrapper.appendChild(codeBlock)

      const computedStyle = getComputedStyle(codeBlock)
      const hasFileNameOffset =
        computedStyle.getPropertyValue('--file-name-offset').trim() !== ''

      const copyButton = document.createElement('button')
      copyButton.type = 'button'
      copyButton.className = [
        'copy-code',
        'absolute end-3 rounded border border-[var(--muted)] bg-[var(--muted)] px-2 py-1',
        'text-xs leading-4 font-medium text-[var(--foreground)]',
        hasFileNameOffset ? 'top-[var(--file-name-offset)]' : '-top-3',
      ].join(' ')
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

      codeBlock.appendChild(copyButton)
    }
  }, [])

  return null
}
