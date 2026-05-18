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

declare global {
  interface Window {
    optimizely?: OptimizelyPushEntry[]
  }
}

const LOG_PREFIX = '[Optimizely]'

/** Set `NEXT_PUBLIC_OPTIMIZELY_DEBUG=true` to log in production builds. Always logs in development. */
function shouldLogOptimizelyEvents(): boolean {
  if (process.env.NODE_ENV === 'development') return true
  return process.env.NEXT_PUBLIC_OPTIMIZELY_DEBUG === 'true'
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
      snippetLoaded: typeof window.optimizely !== 'undefined',
    })
  }
}

/** Fires {@link OPTIMIZELY_WEB_EVENTS.FORM_START} at most once per page load. */
let formStartTracked = false

export function trackFormStartOnce(tags?: Record<string, string>): void {
  if (formStartTracked) {
    if (shouldLogOptimizelyEvents()) {
      console.log(LOG_PREFIX, 'Form Start skipped (already tracked this page load)', {
        tags: tags ?? null,
      })
    }
    return
  }
  formStartTracked = true
  trackOptimizelyEvent(OPTIMIZELY_WEB_EVENTS.FORM_START, tags)
}
