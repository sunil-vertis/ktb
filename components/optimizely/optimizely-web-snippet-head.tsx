'use client'

import Script from 'next/script'

import { resolveOptimizelyWebSnippetId } from '@/lib/optimizely/web-snippet-id'
import { logOptimizelyDiagnostic } from '@/lib/analytics/optimizely-web-events'

/**
 * Optimizely Web snippet — `afterInteractive` avoids React #418 hydration errors.
 * Place at the start of `<body>` in a root layout.
 */
export function OptimizelyWebSnippetHead() {
  const id = resolveOptimizelyWebSnippetId()
  if (!id) {
    if (typeof window !== 'undefined') {
      logOptimizelyDiagnostic('Snippet disabled (NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID=off)')
    }
    return null
  }

  const src = `https://cdn.optimizely.com/js/${id}.js`

  return (
    <Script
      id="optimizely-web-snippet"
      src={src}
      strategy="afterInteractive"
      onLoad={() => {
        logOptimizelyDiagnostic('Snippet script loaded', { src })
      }}
      onError={() => {
        console.error(
          '[Optimizely] Failed to load snippet. Check snippet ID and network/CSP.',
          { src }
        )
      }}
    />
  )
}
