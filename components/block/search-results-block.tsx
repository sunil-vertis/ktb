'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { Tabs } from '@/components/ui/tabs'
import { Pagination } from '@/components/ui/pagination'
import { TextLink } from '@/components/ui/text-link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  searchResults,
  type SearchResultKind,
  type SearchResultRow,
} from '@/lib/data/search-results'

import styles from '@/styles/components/search-results-block.module.scss'

type SortMode = 'relevance' | 'newest'
type TabId = 'all' | 'pages' | 'documents' | 'assets'
const TOPICS = [
  'Deposit',
  'Card',
  'Loan',
  'Insurance',
  'Investments',
  'Services',
  'E-Banking',
]

export type SearchResultsBlockProps = {
  locale: string
  query: string
  /** Server-rendered Optimizely SearchContent hits (replaces mock when provided). */
  initialRows?: SearchResultRow[]
  /** ProductPage-only hits for the Page tab (`SearchContentProductPages`). */
  initialPageRows?: SearchResultRow[]
  /** Total hits from `Searchable.total` when using CMS search + pagination. */
  searchTotal?: number
  /** Total ProductPage hits for the Page tab. */
  searchPageTabTotal?: number
  /** Current 1-based page from `?page=` when using CMS search. */
  searchPage?: number
  /** Must match GraphQL `limit` (default 10). */
  searchPageSize?: number
}

function formatKind(kind: SearchResultKind): string {
  if (kind === 'page') return 'Pages'
  if (kind === 'document') return 'Documents'
  return 'Assets'
}

function safeDateValue(iso?: string): number {
  if (!iso) return -Infinity
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : -Infinity
}

function FilterTopicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <g clipPath="url(#filter-topic-clip)">
        <path
          d="M6.5625 12.7844V8.62633C6.5625 8.41573 6.49601 8.21051 6.37252 8.03993L3.14845 3.5864C2.66978 2.9252 3.14219 2 3.95847 2H11.9941C12.8192 2 13.2893 2.94295 12.7927 3.60188L9.45142 8.03511C9.3207 8.20855 9.25 8.41982 9.25 8.63699V12.178C9.25 12.465 9.12672 12.7381 8.91152 12.9279L8.22402 13.5344C7.57829 14.104 6.5625 13.6455 6.5625 12.7844Z"
          stroke="#185FA5"
          strokeWidth="1.25"
        />
      </g>
      <defs>
        <clipPath id="filter-topic-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function SearchResultsBlock({
  locale,
  query,
  initialRows,
  initialPageRows,
  searchTotal,
  searchPageTabTotal,
  searchPage,
  searchPageSize,
}: SearchResultsBlockProps) {
  const router = useRouter()
  const [searchText, setSearchText] = useState(query)

  useEffect(() => {
    setSearchText(query)
  }, [query])

  const [activeTab, setActiveTab] = useState<TabId>('all')
  const [sort, setSort] = useState<SortMode>('relevance')
  const [page, setPage] = useState(1)
  const [activeTopics, setActiveTopics] = useState<string[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const serverPaged =
    initialRows !== undefined &&
    searchTotal !== undefined &&
    searchPage !== undefined &&
    searchPageSize !== undefined

  const goToSearchPage = (p: number) => {
    const params = new URLSearchParams()
    params.set('q', query)
    if (p > 1) params.set('page', String(p))
    router.push(`/${locale}/search?${params.toString()}`)
  }

  const all = useMemo(() => {
    if (initialRows !== undefined) return initialRows
    return searchResults(query)
  }, [initialRows, query])

  const pages = useMemo(() => all.filter((r) => r.kind === 'page'), [all])
  const documents = useMemo(
    () => all.filter((r) => r.kind === 'document'),
    [all]
  )
  const assets = useMemo(() => all.filter((r) => r.kind === 'asset'), [all])

  const resolvedTabResults = useMemo(() => {
    if (
      activeTab === 'pages' &&
      serverPaged &&
      initialPageRows !== undefined
    ) {
      return initialPageRows
    }
    if (activeTab === 'pages') return pages
    if (activeTab === 'documents') return documents
    if (activeTab === 'assets') return assets
    return all
  }, [
    activeTab,
    serverPaged,
    initialPageRows,
    all,
    pages,
    documents,
    assets,
  ])

  const filtered = useMemo(() => {
    if (activeTopics.length === 0) return resolvedTabResults
    return resolvedTabResults.filter((r) => activeTopics.includes(r.topic))
  }, [activeTopics, resolvedTabResults])

  const allowNewest =
    activeTab === 'documents' || activeTab === 'assets' || activeTab === 'all'

  const resolvedSort: SortMode = allowNewest ? sort : 'relevance'

  const sorted = useMemo(() => {
    // Figma behavior: even on the All tab, "Page" results should appear first.
    const kindPriority: Record<SearchResultKind, number> = {
      page: 0,
      document: 1,
      asset: 2,
    }

    const copy = [...filtered]

    if (resolvedSort === 'relevance') {
      copy.sort((a, b) => {
        const kindCmp =
          activeTab === 'all' ? kindPriority[a.kind] - kindPriority[b.kind] : 0
        return (
          kindCmp ||
          a.rank - b.rank ||
          b.score - a.score ||
          a.title.localeCompare(b.title)
        )
      })
      return copy
    }

    copy.sort((a, b) => {
      const kindCmp =
        activeTab === 'all' ? kindPriority[a.kind] - kindPriority[b.kind] : 0
      return (
        kindCmp ||
        a.rank - b.rank ||
        safeDateValue(b.publishedAt) - safeDateValue(a.publishedAt) ||
        b.score - a.score
      )
    })
    return copy
  }, [resolvedSort, filtered, activeTab])

  const pageSize = searchPageSize ?? 10
  const totalItems = useMemo(() => {
    if (!serverPaged) return sorted.length
    if (activeTab === 'pages') return searchPageTabTotal ?? 0
    return searchTotal ?? 0
  }, [
    serverPaged,
    activeTab,
    searchPageTabTotal,
    searchTotal,
    sorted.length,
  ])
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = serverPaged
    ? searchPage
    : Math.min(Math.max(1, page), totalPages)

  const pageItems = useMemo(() => {
    if (serverPaged) return sorted
    const start = (currentPage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [serverPaged, currentPage, sorted, pageSize])

  const tabItems = useMemo(() => {
    if (serverPaged) {
      return [
        { id: 'all', label: `All(${searchTotal})` },
        {
          id: 'pages',
          label: `Page(${searchPageTabTotal ?? 0})`,
        },
        { id: 'documents', label: `Document(${documents.length})` },
        { id: 'assets', label: `Asset(${assets.length})` },
      ]
    }
    return [
      { id: 'all', label: `All(${all.length})` },
      { id: 'pages', label: `Page(${pages.length})` },
      { id: 'documents', label: `Document(${documents.length})` },
      { id: 'assets', label: `Asset(${assets.length})` },
    ]
  }, [
    serverPaged,
    searchTotal,
    searchPageTabTotal,
    all.length,
    pages.length,
    documents.length,
    assets.length,
  ])

  const subtitle = useMemo(() => {
    if (!query) return '0 search results'
    if (!serverPaged) return `${all.length} search results`
    if (activeTab === 'pages') return `${searchPageTabTotal ?? 0} search results`
    return `${searchTotal ?? 0} search results`
  }, [query, serverPaged, activeTab, all.length, searchTotal, searchPageTabTotal])

  const onTabChange = (id: string) => {
    setActiveTab(id as TabId)
    if (serverPaged) goToSearchPage(1)
    else setPage(1)
  }

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = searchText.trim()
    if (!next) return
    const qs = new URLSearchParams({ q: next }).toString()
    router.push(`/${locale}/search?${qs}`)
  }

  const toggleTopic = (topic: string, closeOnMobile = false) => {
    if (serverPaged) goToSearchPage(1)
    else setPage(1)
    setActiveTopics((prev) =>
      prev.includes(topic) ? prev.filter((v) => v !== topic) : [...prev, topic]
    )
    if (closeOnMobile) setIsMobileFilterOpen(false)
  }

  return (
    <section className={styles.root}>
      <div className="container mx-auto px-4">
        <h1 className={styles.title}>Search Results</h1>

        <form className={styles.searchForm} onSubmit={onSearchSubmit}>
          <Image
            src="/assets/search/search-icon.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
            placeholder="Search here"
          />
        </form>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.tabsSortRow}>
          <div className={styles.tabsWrap}>
            <Tabs
              items={tabItems}
              activeId={activeTab}
              onChange={onTabChange}
              showPanels={false}
            />
          </div>

          <div className={styles.sortControl}>
            <div className={styles.sortLabel}>Sort by:</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={styles.sortTrigger}
                  disabled={!allowNewest}
                  aria-disabled={!allowNewest || undefined}
                >
                  <span>
                    {resolvedSort === 'relevance' ? 'Relevance' : 'Newest'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="8"
                    viewBox="0 0 15 8"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M13.3612 0.263368C13.7358 -0.0877892 14.3304 -0.0877893 14.705 0.263368C15.0976 0.631792 15.0978 1.24275 14.705 1.61104L8.17171 7.73611L8.13558 7.76736L8.06234 7.82303L8.02034 7.8533C7.65369 8.08029 7.15788 8.04517 6.82795 7.73611L0.294688 1.61104C-0.0982495 1.24267 -0.0982091 0.631766 0.294688 0.263368C0.669265 -0.0877892 1.26387 -0.0877893 1.63845 0.263368L7.49983 5.75855L13.3612 0.263368Z"
                      fill="#002533"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={styles.sortMenu}>
                <DropdownMenuItem
                  className={styles.sortItem}
                  onSelect={() => {
                    setSort('relevance')
                    if (serverPaged) goToSearchPage(searchPage)
                    else setPage(1)
                  }}
                >
                  Relevance
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={styles.sortItem}
                  disabled={!allowNewest}
                  onSelect={() => {
                    if (!allowNewest) return
                    setSort('newest')
                    if (serverPaged) goToSearchPage(searchPage)
                    else setPage(1)
                  }}
                >
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className={styles.mobileFilterRow}>
          <TextLink
            asChild
            size="S"
            state="active"
            icon={<FilterTopicIcon />}
            iconPosition="right"
          >
            <button
              type="button"
              className={styles.mobileFilterLink}
              onClick={() => setIsMobileFilterOpen(true)}
            >
              Filter by Topic
            </button>
          </TextLink>
        </div>

        {activeTopics.length > 0 ? (
          <div className={styles.mobileFilterAppliedRow}>
            <p className={styles.mobileFilterAppliedText}>
              {activeTopics.length === 1
                ? `${activeTopics[0]} filter selected`
                : `${activeTopics.length} filters selected`}
            </p>
            <button
              type="button"
              className={styles.mobileFilterAppliedClear}
              onClick={() => setActiveTopics([])}
            >
              Clear
            </button>
          </div>
        ) : null}

        {isMobileFilterOpen ? (
          <div className={styles.mobileFilterDrawerRoot}>
            <button
              type="button"
              className={styles.mobileFilterDrawerBackdrop}
              aria-label="Close filter drawer"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div
              className={styles.mobileFilterDrawerPanel}
              role="dialog"
              aria-modal="true"
              aria-label="Filter by topic"
            >
              <div className={styles.mobileFilterDrawerHeader}>
                <p className={styles.mobileFilterDrawerTitle}>Filter by Topic</p>
                <button
                  type="button"
                  className={styles.mobileFilterDrawerClose}
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className={styles.mobileFilterDrawerOptions}>
                {TOPICS.map((topic) => (
                  <label key={`mobile-${topic}`} className={styles.topicItem}>
                    <input
                      type="checkbox"
                      checked={activeTopics.includes(topic)}
                      onChange={() => toggleTopic(topic, true)}
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {query ? (
          <div className={styles.contentGrid}>
            <aside className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <span>Filter by Topic:</span>
                <button
                  type="button"
                  onClick={() => setActiveTopics([])}
                  className={styles.clearBtn}
                >
                  Clear
                </button>
              </div>
              <div className={styles.topicList}>
                {TOPICS.map((topic) => (
                  <label key={topic} className={styles.topicItem}>
                    <input
                      type="checkbox"
                      checked={activeTopics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            </aside>

            <div className={styles.resultsList}>
              {totalItems === 0 ? (
                <div className={styles.empty}>
                  <h2 className={styles.emptyTitle}>No results found</h2>
                  <p className={styles.emptyText}>
                    We couldn&apos;t find anything matching your search.
                    <br />
                    Try different keywords or adjust your filters.
                  </p>
                </div>
              ) : (
                pageItems.map((item, idx) => {
                  const href = `/${locale}${item.path}`
                  return (
                    <Fragment key={`${item.id}-${idx}`}>
                      <article className={styles.resultCard}>
                        {item.showImage ? (
                          <div className={styles.resultImageWrap}>
                            <Image
                              src={
                                item.imageSrc ??
                                '/assets/search/loan-card-hero.png'
                              }
                              alt={item.title}
                              width={282}
                              height={158}
                              className={styles.resultImage}
                            />
                          </div>
                        ) : null}
                        <div className={styles.resultBody}>
                          <div className={styles.resultMeta}>
                            <span className={styles.kindPill}>
                              {formatKind(item.kind).slice(0, -1)}
                            </span>
                            <span className={styles.topicPill}>
                              {item.topic}
                            </span>
                            {item.subTopic ? (
                              <span className={styles.topicPill}>
                                {item.subTopic}
                              </span>
                            ) : null}
                          </div>
                          <h2 className={styles.resultTitle}>
                            <Link href={href}>{item.title}</Link>
                          </h2>
                          {item.description ? (
                            <p className={styles.resultDesc}>
                              {item.description}
                            </p>
                          ) : null}
                          <p className={styles.resultLink}>
                            {`${(
                              process.env.NEXT_PUBLIC_SITE_URL ??
                              'https://krungthai.com'
                            ).replace(/\/$/, '')}/${locale}${item.path}`}
                          </p>
                        </div>
                      </article>
                      {idx < pageItems.length - 1 ? (
                        <div className={styles.divider} />
                      ) : null}
                    </Fragment>
                  )
                })
              )}
            </div>
          </div>
        ) : null}

        {query && totalItems > 0 ? (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(p) => {
                if (serverPaged) goToSearchPage(p)
                else setPage(p)
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
