/** Default project snippet from Optimizely → Settings → Implementation. */
export const DEFAULT_OPTIMIZELY_WEB_SNIPPET_ID = '4755673972473856'

/**
 * Resolves the Web Experimentation snippet ID (inlined at build time via NEXT_PUBLIC_*).
 * Empty / unset → default. Set to `off` or `false` to disable the script entirely.
 */
export function resolveOptimizelyWebSnippetId(): string | null {
  const raw = process.env.NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID?.trim()
  if (!raw || raw === 'off' || raw === 'false' || raw === '0') {
    if (raw === 'off' || raw === 'false' || raw === '0') return null
    return DEFAULT_OPTIMIZELY_WEB_SNIPPET_ID
  }
  if (/^\d+$/.test(raw)) return raw
  return raw
}
