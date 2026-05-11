'use client'

import * as React from 'react'
import clsx from 'clsx'

import { GlobalIcon } from '@/components/ui/global-icon'
import { getPaginationRange } from '@/lib/ui/pagination-range'

export interface PaginationProps {
  /** Current page (1-based). */
  currentPage: number
  /** Total number of pages (>= 1). */
  totalPages: number
  /** Total items across all pages (for “Showing X–Y of Z”). */
  totalItems: number
  /** Items per page. */
  pageSize: number
  /** Called with the selected 1-based page index. */
  onPageChange: (page: number) => void
  className?: string
  /** Accessible label for the navigation landmark. */
  ariaLabel?: string
  /** When false, the summary line is omitted. */
  showSummary?: boolean
}

function clampPage(page: number, total: number): number {
  if (total < 1) return 1
  return Math.min(Math.max(1, Math.floor(page)), total)
}

function getMobilePaginationRange(
  currentPage: number,
  totalPages: number
): Array<number | 'ellipsis'> {
  if (totalPages <= 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 2) {
    return [1, 2, 'ellipsis']
  }

  if (currentPage >= totalPages) {
    return [1, 'ellipsis', totalPages]
  }

  return [1, currentPage, 'ellipsis']
}

function formatRangeLabel(
  page: number,
  pageSize: number,
  totalItems: number
): string {
  if (totalItems <= 0) {
    return 'Showing 0 of 0'
  }
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)
  return `Showing ${start}-${end} of ${totalItems}`
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
  ariaLabel = 'Pagination',
  showSummary = true,
}: PaginationProps) {
  const safeTotal = Math.max(0, Math.floor(totalPages))
  const page = clampPage(currentPage, safeTotal || 1)
  const safePageSize = Math.max(1, Math.floor(pageSize))
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 1023px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const items = React.useMemo(
    () =>
      safeTotal < 1
        ? []
        : isMobile
          ? getMobilePaginationRange(page, safeTotal)
          : getPaginationRange(page, safeTotal, 1),
    [isMobile, page, safeTotal]
  )

  if (safeTotal < 1) {
    return null
  }

  const go = (next: number) => {
    const p = clampPage(next, safeTotal)
    if (p !== page) onPageChange(p)
  }

  const summaryText = formatRangeLabel(page, safePageSize, totalItems)

  return (
    <div className={clsx('pagination', className)}>
      {showSummary && (
        <p className="pagination__summary">{summaryText}</p>
      )}
      <nav className="pagination__nav" aria-label={ariaLabel}>
        <div className="pagination__shell">
          <ol className="pagination__rail">
            <li
              className={clsx(
                'pagination__segment',
                'pagination__segment--prev',
                page <= 1 && 'is-disabled'
              )}
            >
              <button
                type="button"
                className="pagination__edge-btn"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => go(page - 1)}
              >
                <span
                  className="pagination__chevron pagination__chevron--prev"
                  aria-hidden
                >
                  <GlobalIcon type="chevron-right" size="S" />
                </span>
                <span className="pagination__edge-label">Previous</span>
              </button>
            </li>

            {items.map((item, index) => {
              if (item === 'ellipsis') {
                return (
                  <li
                    key={`ellipsis-${index}`}
                    className={clsx(
                      'pagination__segment',
                      'pagination__segment--page',
                      'pagination__segment--ellipsis'
                    )}
                  >
                    <span className="pagination__ellipsis" aria-hidden>
                      ...
                    </span>
                  </li>
                )
              }

              const isActive = item === page
              return (
                <li
                  key={`page-${item}-${index}`}
                  className={clsx(
                    'pagination__segment',
                    'pagination__segment--page',
                    isActive && 'is-active'
                  )}
                >
                  <button
                    type="button"
                    className="pagination__page-btn"
                    aria-label={`Page ${item}`}
                    aria-current={isActive ? 'page' : undefined}
                    disabled={isActive}
                    onClick={() => go(item)}
                  >
                    {item}
                  </button>
                </li>
              )
            })}

            <li
              className={clsx(
                'pagination__segment',
                'pagination__segment--next',
                page >= safeTotal && 'is-disabled'
              )}
            >
              <button
                type="button"
                className="pagination__edge-btn pagination__edge-btn--next"
                aria-label="Next page"
                disabled={page >= safeTotal}
                onClick={() => go(page + 1)}
              >
                <span className="pagination__edge-label">Next</span>
                <span className="pagination__chevron" aria-hidden>
                  <GlobalIcon type="chevron-right" size="S" />
                </span>
              </button>
            </li>
          </ol>
        </div>
      </nav>
    </div>
  )
}
