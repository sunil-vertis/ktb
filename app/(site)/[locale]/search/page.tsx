import { SearchResultsBlock } from '@/components/block/search-results-block'
import type { SearchResultRow } from '@/lib/data/search-results'
import { optimizely } from '@/lib/optimizely/fetch'
import { getValidLocale } from '@/lib/optimizely/utils/language'
import { SEARCH_PAGE_SIZE } from '@/lib/search/search-page-size'
import { mapSearchContentToRows } from '@/lib/search/map-search-content-response'
import { generateAlternates } from '@/lib/utils/metadata'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

function parseSearchPage(raw: string | string[] | undefined): number {
  if (typeof raw !== 'string') return 1
  const n = Number.parseInt(raw.trim(), 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

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
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>
}) {
  const { locale } = await props.params
  const sp = await props.searchParams
  const raw = sp.q
  const query = typeof raw === 'string' ? raw.trim() : ''

  let initialRows: SearchResultRow[] | undefined
  let initialPageRows: SearchResultRow[] | undefined
  let searchTotal: number | undefined
  let searchPageTabTotal: number | undefined
  let searchPage: number | undefined

  if (query) {
    const locales = getValidLocale(locale)
    const pageNum = parseSearchPage(sp.page)
    const skip = (pageNum - 1) * SEARCH_PAGE_SIZE

    const [allResp, productPagesResp] = await Promise.all([
      optimizely.SearchContent({
        searchText: query,
        language: [locales],
        skip,
        limit: SEARCH_PAGE_SIZE,
      }),
      optimizely.SearchContentProductPages({
        searchText: query,
        language: [locales],
        skip,
        limit: SEARCH_PAGE_SIZE,
      }),
    ])

    if (process.env.NODE_ENV === 'development' && allResp.errors?.length) {
      console.error('[SearchContent] GraphQL errors', {
        locale,
        query,
        errors: allResp.errors,
      })
    }
    if (process.env.NODE_ENV === 'development' && productPagesResp.errors?.length) {
      console.error('[SearchContentProductPages] GraphQL errors', {
        locale,
        query,
        errors: productPagesResp.errors,
      })
    }

    const total = allResp.data?.Searchable?.total ?? 0
    const maxPage =
      total > 0 ? Math.ceil(total / SEARCH_PAGE_SIZE) : 1

    if (pageNum > maxPage) {
      const p = new URLSearchParams()
      p.set('q', query)
      if (maxPage > 1) p.set('page', String(maxPage))
      redirect(`/${locale}/search?${p.toString()}`)
    }
    if (total === 0 && pageNum > 1) {
      redirect(`/${locale}/search?q=${encodeURIComponent(query)}`)
    }

    initialRows = mapSearchContentToRows(allResp.data ?? undefined, {
      rankOffset: skip,
    })
    initialPageRows = mapSearchContentToRows(
      productPagesResp.data ?? undefined,
      { rankOffset: skip }
    )
    searchTotal = total
    searchPageTabTotal = productPagesResp.data?.Searchable?.total ?? 0
    searchPage = pageNum
  }

  return (
    <SearchResultsBlock
      locale={locale}
      query={query}
      initialRows={initialRows}
      initialPageRows={initialPageRows}
      searchTotal={searchTotal}
      searchPageTabTotal={searchPageTabTotal}
      searchPage={searchPage}
      searchPageSize={SEARCH_PAGE_SIZE}
    />
  )
}
