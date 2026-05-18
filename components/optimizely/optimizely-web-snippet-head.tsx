/**
 * Optimizely Web Experimentation / Personalization snippet (loads from CDN).
 * Snippet ID: Optimizely → Settings → Implementation, or your project’s “JS snippet” URL.
 *
 * Optional env: `NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID` (digits only). If unset, uses the
 * project default below. Set to empty string to skip loading the script (extend logic if needed).
 *
 * Uses a synchronous vendor `<script>` in `<head>` per Optimizely’s implementation guidance.
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

/** Renders inside `<head>` of a root layout. */
export function OptimizelyWebSnippetHead() {
  const id = resolveSnippetId()
  if (!id) return null
  return (
    // eslint-disable-next-line @next/next/no-sync-scripts -- Optimizely CDN snippet (vendor-recommended load order)
    <script src={`https://cdn.optimizely.com/js/${id}.js`} />
  )
}
