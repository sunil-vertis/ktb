export type SearchResultKind = 'page' | 'document' | 'asset'
export type SearchTopic =
  | 'Deposit'
  | 'Card'
  | 'Loan'
  | 'Insurance'
  | 'Investments'
  | 'Services'
  | 'E-Banking'

export type SearchResultItem = {
  id: string
  kind: SearchResultKind
  title: string
  description?: string
  path: string
  topic: SearchTopic
  subTopic?: string
  imageSrc?: string
  showImage?: boolean
  /**
   * Stable ordering hint used to match Figma's top items.
   * Lower rank means higher priority within the same tab.
   */
  rank: number
  publishedAt?: string
}

/** One search hit with a client-side relevance score (sorting / tabs). */
export type SearchResultRow = SearchResultItem & { score: number }

const CORE_RESULTS: SearchResultItem[] = [
  {
    id: 'page-auto-loan',
    kind: 'page',
    title: 'Auto Loan (New Car)',
    description:
      'Finance your new car with flexible repayment plans, competitive interest rates, and fast approval.',
    path: '/auto-loan',
    topic: 'Loan',
    imageSrc: '/assets/search/loan-card-hero.png',
    showImage: true,
    rank: 1,
  },
  {
    id: 'page-express-loan',
    kind: 'page',
    title: 'Express Loan - Quick Personal Loan',
    description:
      'Access instant cash with no collateral required and enjoy a simple online application process.',
    path: '/xpress-loan',
    topic: 'Loan',
    subTopic: 'E-Banking',
    imageSrc: '/assets/search/loan-card-hero.png',
    showImage: true,
    rank: 2,
  },
  {
    id: 'doc-personal-loan-terms',
    kind: 'document',
    title: 'Personal Loan Terms & Conditions',
    description:
      'Comprehensive details on eligibility, interest rates, fees, and repayment conditions for personal loan products.',
    path: '/docs/personal-loan-terms.pdf',
    topic: 'Loan',
    publishedAt: '2026-04-18',
    rank: 1,
  },
  {
    id: 'doc-home-loan-form',
    kind: 'document',
    title: 'Home Loan Application Form',
    description:
      'Download the official mortgage application form along with required documentation to begin your home financing process.',
    path: '/docs/home-loan-form.pdf',
    topic: 'Loan',
    publishedAt: '2026-03-20',
    rank: 2,
  },
  {
    id: 'asset-loan-protection-brochure',
    kind: 'asset',
    title: 'Loan Protection Insurance Brochure',
    description:
      'Explore insurance coverage options designed to protect your loan repayments in case of unexpected events.',
    path: '/docs/home-loan-form.pdf',
    topic: 'Insurance',
    publishedAt: '2026-05-01',
    rank: 1,
  },
]

function makeFiller(kind: SearchResultKind, index: number): SearchResultItem {
  const topic: SearchTopic = kind === 'asset' ? 'Services' : 'Loan'
  return {
    id: `${kind}-filler-${index}`,
    kind,
    title: `${kind === 'page' ? 'Loan Product' : kind === 'document' ? 'Loan Document' : 'Loan Asset'} ${index + 1}`,
    description: 'Additional result to mirror design volume for pagination and tabs.',
    path: '/loan',
    topic,
    publishedAt: `2025-12-${String(((index % 20) + 1)).padStart(2, '0')}`,
    rank: 1000 + index,
  }
}

const PAGES_TARGET = 8
const DOCUMENTS_TARGET = 20
const ASSETS_TARGET = 20

const pages = CORE_RESULTS.filter((r) => r.kind === 'page')
const documents = CORE_RESULTS.filter((r) => r.kind === 'document')
const assets = CORE_RESULTS.filter((r) => r.kind === 'asset')

while (pages.length < PAGES_TARGET) pages.push(makeFiller('page', pages.length))
while (documents.length < DOCUMENTS_TARGET)
  documents.push(makeFiller('document', documents.length))
while (assets.length < ASSETS_TARGET) assets.push(makeFiller('asset', assets.length))

export const SEARCH_RESULTS_INDEX: SearchResultItem[] = [...pages, ...documents, ...assets]

function tokenize(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

export function scoreResult(item: SearchResultItem, query: string): number {
  const words = tokenize(query)
  if (words.length === 0) return 0

  const hay = `${item.title} ${item.description ?? ''}`.toLowerCase()
  if (!words.every((w) => hay.includes(w))) return -1

  // Simple relevance: prefix > substring > per-word proximity.
  const q = query.trim().toLowerCase()
  let score = 0

  if (item.title.toLowerCase().startsWith(q)) score += 200
  const idx = hay.indexOf(q)
  if (idx >= 0) score += 100 - Math.min(idx, 99)

  for (const w of words) {
    const wi = hay.indexOf(w)
    if (wi >= 0) score += 30 - Math.min(wi, 29)
  }
  return score
}

export function searchResults(query: string): Array<SearchResultItem & { score: number }> {
  const q = query.trim()
  if (!q) return []

  const out: Array<SearchResultItem & { score: number }> = []
  for (const item of SEARCH_RESULTS_INDEX) {
    const score = scoreResult(item, q)
    if (score < 0) continue
    out.push({ ...item, score })
  }

  out.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  return out
}

