import { SearchResultsBlock } from '@/components/block/search-results-block'
import { generateAlternates } from '@/lib/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string | string[] }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const sp = await props.searchParams
  const raw = sp.q
  const q = typeof raw === 'string' ? raw.trim() : ''
  return {
    title: q ? `Search — ${q}` : 'Search',
    alternates: generateAlternates(locale, 'search'),
  }
}

export default async function SearchResultsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const { locale } = await props.params
  const sp = await props.searchParams
  const raw = sp.q
  const query = typeof raw === 'string' ? raw.trim() : ''

  return <SearchResultsBlock locale={locale} query={query} />
}
