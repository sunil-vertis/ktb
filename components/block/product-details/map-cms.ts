/** Map Optimizely Content Graph fields to PDP presentation props. */

export function mediaRefToUrl(
  ref:
    | { __typename?: string; _assetMetadata?: { url?: string | null } | null }
    | null
    | undefined
): string | undefined {
  if (!ref) return undefined
  if (ref.__typename === 'ImageMedia' || ref.__typename === 'GenericMedia') {
    const u = ref._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

export function linkToAbsoluteUrl(
  link:
    | {
        url?: {
          default?: string | null
          base?: string | null
          hierarchical?: string | null
          internal?: string | null
        } | null
      }
    | null
    | undefined
): string | undefined {
  if (!link?.url) return undefined
  const u =
    link.url.default?.trim() ||
    link.url.hierarchical?.trim() ||
    link.url.internal?.trim() ||
    link.url.base?.trim()
  return u || undefined
}

export function richTextToPlainLines(
  html: string | null | undefined
): string[] | undefined {
  if (!html?.trim()) return undefined
  const normalized = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
  const stripped = normalized.replace(/<[^>]+>/g, ' ')
  const lines = stripped
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return lines.length ? lines : undefined
}

export function parseLimitGrantedColumnHeaders(
  raw: string | null | undefined
): string[] | undefined {
  if (!raw?.trim()) return undefined
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return parsed as string[]
    }
  } catch {
    /* delimiter fallback */
  }
  if (raw.includes('|')) {
    const parts = raw
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length) return parts
  }
  return [raw.trim()]
}
