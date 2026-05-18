'use client'

import Script from 'next/script'

/**
 * Optimizely Web Experimentation / Personalization snippet.
 * Loaded with `afterInteractive` so the vendor script does not run before React hydration
 * (sync `<script>` in `<head>` causes React #418 on production).
 */
const DEFAULT_SNIPPET_ID = '4755673972473856'

function resolveSnippetId(): string | null {
  const raw = process.env.NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID
  if (raw === '') return null
  const trimmed = raw?.trim()
  if (trimmed && /^\d+$/.test(trimmed)) return trimmed
  if (trimmed) return trimmed
  return DEFAULT_SNIPPET_ID
}

/** Place at the start of `<body>` in a root layout (not inside `<head>`). */
export function OptimizelyWebSnippetHead() {
  const id = resolveSnippetId()
  if (!id) return null
  return (
    <Script
      id="optimizely-web-snippet"
      src={`https://cdn.optimizely.com/js/${id}.js`}
      strategy="afterInteractive"
    />
  )
}
