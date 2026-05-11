/**
 * Full-text search corpus for site search (sync with header nav labels/links where applicable).
 */
export const POPULAR_SEARCH_TERMS = [
  'Fixed Deposit Rates',
  'Travel Insurance',
  'Personal Loan',
] as const

export const SITE_SEARCH_CORPUS: string[] = [
  ...POPULAR_SEARCH_TERMS,
  'Credit Card',
  'Savings Deposit',
  'Housing loan rates',
  'Loan calculator',
  'Current account deposit',
  'Savings deposit',
  'Fixed deposit',
  'Tax-free deposits',
  'Foreign currency deposits',
  'Krungthai NEXT online deposit',
  'Paometang savings account',
  'Krungthai payroll solution',
  'Krungthai PromptPay',
  'Transfer money',
  'Accept payments',
  'Currency and foreign exchange',
  'Financial guidance for studying abroad',
  'Deposit',
  'Card',
  'Loan',
  'Insurance',
  'Investment',
  'Services',
  'E-Banking',
]

const CORPUS_UNIQUE = Array.from(new Set(SITE_SEARCH_CORPUS.map((s) => s.trim()).filter(Boolean)))

/** Case-insensitive: every whitespace-separated token must appear somewhere in the term. */
export function matchesFullText(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return false
  const words = q.split(/\s+/).filter(Boolean)
  const h = haystack.toLowerCase()
  return words.every((w) => h.includes(w))
}

export function rankSearchMatches(query: string, limit = 20): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const words = q.split(/\s+/).filter(Boolean)
  const scored: { term: string; score: number }[] = []

  for (const term of CORPUS_UNIQUE) {
    const t = term.toLowerCase()
    if (!words.every((w) => t.includes(w))) continue

    let score = 0
    if (t.startsWith(q)) score += 200
    const idx = t.indexOf(q)
    if (idx >= 0) score += 100 - Math.min(idx, 99)
    for (const w of words) {
      const wi = t.indexOf(w)
      if (wi >= 0) score += 30 - Math.min(wi, 29)
    }
    scored.push({ term, score })
  }

  scored.sort((a, b) => b.score - a.score || a.term.localeCompare(b.term))
  return scored.slice(0, limit).map((s) => s.term)
}
