/**
 * Optimizely Web Experimentation custom events.
 * Event names must match Implementation → Events in your Optimizely project exactly.
 */
export const OPTIMIZELY_WEB_EVENTS = {
  CTA_FORM_CLICK: 'CTA form click event',
  FORM_START: 'Form Start event',
  FORM_SUBMIT: 'Form Submit event',
  CLICK_APP_DOWNLOAD: 'Click App Download event',
  VIEW_CONTENT_DETAILS: 'View Content Details event',
} as const

export type OptimizelyWebEventName =
  (typeof OPTIMIZELY_WEB_EVENTS)[keyof typeof OPTIMIZELY_WEB_EVENTS]

type OptimizelyPushEntry =
  | { type: 'event'; eventName: string; tags?: Record<string, string> }
  | Record<string, unknown>

type OptimizelyClient = OptimizelyPushEntry[] & {
  get?: (key: string) => unknown
  initialized?: boolean
}

declare global {
  interface Window {
    optimizely?: OptimizelyClient
  }
}

const LOG_PREFIX = '[Optimizely]'

/** Dev, `NEXT_PUBLIC_OPTIMIZELY_DEBUG=true`, or `?optimizely_debug=1` on the URL. */
export function shouldLogOptimizelyEvents(): boolean {
  if (process.env.NODE_ENV === 'development') return true
  if (process.env.NEXT_PUBLIC_OPTIMIZELY_DEBUG === 'true') return true
  if (typeof window !== 'undefined') {
    try {
      return new URLSearchParams(window.location.search).get('optimizely_debug') === '1'
    } catch {
      return false
    }
  }
  return false
}

export function logOptimizelyDiagnostic(message: string, data?: Record<string, unknown>): void {
  if (!shouldLogOptimizelyEvents()) return
  console.log(LOG_PREFIX, message, data ?? '')
}

function isOptimizelyApiReady(): boolean {
  return typeof window.optimizely?.get === 'function'
}

function getSnippetScriptInDom(): boolean {
  return Boolean(
    document.querySelector('script#optimizely-web-snippet') ||
      document.querySelector('script[src*="cdn.optimizely.com/js/"]')
  )
}

export function trackOptimizelyEvent(
  eventName: OptimizelyWebEventName,
  tags?: Record<string, string>
): void {
  if (typeof window === 'undefined') return

  const payload = {
    type: 'event' as const,
    eventName,
    ...(tags && Object.keys(tags).length > 0 ? { tags } : {}),
  }

  window.optimizely = window.optimizely || []
  window.optimizely.push(payload)

  if (shouldLogOptimizelyEvents()) {
    console.log(LOG_PREFIX, 'Event tracked', {
      eventName,
      tags: tags ?? null,
      payload,
      queueLength: window.optimizely.length,
      apiReady: isOptimizelyApiReady(),
      snippetScriptInDom: getSnippetScriptInDom(),
      hint: !getSnippetScriptInDom()
        ? 'Snippet script tag missing — set NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID or redeploy after env changes'
        : !isOptimizelyApiReady()
          ? 'Event queued; wait for snippet onLoad (afterInteractive). No logx POST until snippet runs.'
          : 'Snippet ready — expect POST to logx.optimizely.com/v1/events',
    })
  }
}

/** Fires {@link OPTIMIZELY_WEB_EVENTS.FORM_START} at most once per page load. */
let formStartTracked = false

export function trackFormStartOnce(tags?: Record<string, string>): void {
  if (formStartTracked) {
    logOptimizelyDiagnostic('Form Start skipped (already tracked this page load)', {
      tags: tags ?? null,
    })
    return
  }
  formStartTracked = true
  trackOptimizelyEvent(OPTIMIZELY_WEB_EVENTS.FORM_START, tags)
}
