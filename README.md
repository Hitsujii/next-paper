# NextPaper

> AstroPaper, but for Next.js.

NextPaper is a minimal Next.js blog starter inspired by [AstroPaper](https://github.com/satnaing/astro-paper) and built on top of [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog).

It is for people who want the calm, readable feel of AstroPaper without leaving the Next.js ecosystem. You get Contentlayer, MDX, tags, archives, local search, newsletter support, comments, RSS, sitemap and a clean layout that works well for personal blogs, technical writing and small portfolio sites.

NextPaper is not an Astro theme. It is a Next.js starter that treats AstroPaper as the visual baseline and gives full credit to the projects it builds on.

## Features

- Next.js App Router
- Contentlayer and MDX
- Blog posts, tags and archives
- Projects page
- Local search
- Newsletter support
- Comments support
- Dark mode
- RSS and sitemap
- SEO metadata
- Code blocks with filename tabs and copy button
- Table of contents
- Share links
- Responsive layout
- View-transition-friendly UI

## Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Contentlayer](https://contentlayer.dev/)
- [MDX](https://mdxjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pliny](https://github.com/timlrx/pliny)

## Getting started

Install dependencies:

```bash
yarn install
```

Start the dev server:

```bash
yarn dev
```

Build for production:

```bash
yarn build
```

Run linting:

```bash
yarn lint
```

## Content

Blog posts live in `data/blog`.

A basic post looks like this:

```mdx
---
title: My post title
date: '2026-01-01'
tags: ['next-js', 'mdx']
draft: false
summary: A short summary of the post.
---
```

Author profiles live in `data/authors`, with the default profile in `data/authors/default.mdx`.

Projects are configured in `data/projectsData.ts`.

## Configuration

Most site settings are in `data/siteMetadata.js`.

That file controls metadata, social links, comments, analytics, newsletter settings, RSS and SEO-related values.

Navigation links are configured in `data/headerNavLinks.ts`.

Static assets live in `public`.

## Search

NextPaper uses a generated local search index at `public/search.json`.

The search UI is inspired by AstroPaper and Pagefind-style result lists, while keeping the original NextPaper search pipeline.

## Credits

NextPaper stands on the shoulders of two great open-source projects:

- [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) by Timothy Lin, used as the technical foundation.
- [AstroPaper](https://github.com/satnaing/astro-paper) by Sat Naing, used as the visual baseline and design inspiration.

## License

Licensed under the MIT License.
