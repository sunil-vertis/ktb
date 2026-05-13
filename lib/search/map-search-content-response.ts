import type { SearchContentQuery } from '@/lib/optimizely/types/generated'
import type {
  SearchResultKind,
  SearchResultRow,
  SearchTopic,
} from '@/lib/data/search-results'
import { mapPathWithoutLocale } from '@/lib/optimizely/utils/language'

const TOPICS: SearchTopic[] = [
  'Deposit',
  'Card',
  'Loan',
  'Insurance',
  'Investments',
  'Services',
  'E-Banking',
]

function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function urlPathnameOnly(urlDefault: string): string {
  const d = urlDefault.trim()
  if (!d) return '/'
  if (d.startsWith('http://') || d.startsWith('https://')) {
    try {
      const p = new URL(d).pathname
      return p && p !== '/' ? p : '/'
    } catch {
      return d.startsWith('/') ? d : `/${d}`
    }
  }
  return d.startsWith('/') ? d : `/${d}`
}

function inferKind(
  item: { __typename?: string | null },
  urlDefault: string | null | undefined
): SearchResultKind {
  const tn = item.__typename ?? ''
  const path = (urlDefault ?? '').split('?')[0]?.toLowerCase() ?? ''
  if (/\.(pdf|doc|docx|xlsx?|zip)$/.test(path)) return 'document'
  if (tn === 'GenericMedia' || tn === 'ImageMedia' || tn === 'VideoMedia') {
    return 'asset'
  }
  return 'page'
}

function inferTopic(
  keywords: string | null | undefined,
  title: string
): SearchTopic {
  const blob = `${keywords ?? ''} ${title}`.toLowerCase()
  for (const t of TOPICS) {
    if (blob.includes(t.toLowerCase())) return t
  }
  return 'Services'
}

export function mapSearchContentToRows(
  data: SearchContentQuery | null | undefined,
  options?: { rankOffset?: number }
): SearchResultRow[] {
  const items = data?.Searchable?.items
  if (!items?.length) return []

  const rankBase = options?.rankOffset ?? 0
  const rows: SearchResultRow[] = []
  let idx = 0
  for (const raw of items) {
    if (!raw) continue
    const urlFull = raw._metadata?.url?.default ?? ''
    const pathname = urlPathnameOnly(urlFull)
    const rest = mapPathWithoutLocale(pathname)
    const path = rest ? `/${rest}` : '/'
    const title = stripHtml(raw.SearchTitle?.html) || 'Untitled'
    const description = stripHtml(raw.SearchDescription?.html) || undefined
    const kind = inferKind(raw, urlFull)
    const topic = inferTopic(raw.SearchKeywords, title)
    const rank = rankBase + idx + 1
    rows.push({
      id: `${raw.__typename ?? 'SearchHit'}-${idx}-${path}`,
      kind,
      title,
      description,
      path,
      topic,
      rank,
      publishedAt: raw.SearchDate ? String(raw.SearchDate) : undefined,
      score: 1000 - rank,
    })
    idx += 1
  }
  return rows
}
