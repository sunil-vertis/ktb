'use client'

import * as React from 'react'
import clsx from 'clsx'

import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'

import type { DownloadSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import { linkToAbsoluteUrl } from './map-cms'

type DownloadSortKey = 'name' | 'date-newest' | 'date-oldest' | 'size'

export type DownloadResourceItem = {
  id: string
  label: string
  extension?: string
  sizeLabel?: string
  sizeInMb?: number
  publishedAt?: string
  href: string
}

export type DownloadSectionBlockProps = {
  title?: string
  sortLabel?: string
  items?: DownloadResourceItem[]
  className?: string
  sectionId?: string
}

const DEFAULT_ITEMS: DownloadResourceItem[] = [
  {
    id: 'sales-sheet',
    label: 'Sales Sheet for Krungthai Thanawat Loan',
    extension: 'PDF',
    sizeLabel: '0.19 MB',
    sizeInMb: 0.19,
    publishedAt: '2026-04-01',
    href: '#',
  },
  {
    id: 'loan-calculation',
    label: 'Krungthai Thanawat loan calculation',
    extension: 'PDF',
    sizeLabel: '0.19 MB',
    sizeInMb: 0.19,
    publishedAt: '2026-04-01',
    href: '#',
  },
  {
    id: 'interest-fees-expenses',
    label: 'Interest rates, service fees, charges, and other expenses',
    extension: 'PDF',
    sizeLabel: '0.19 MB',
    sizeInMb: 0.19,
    publishedAt: '2026-04-01',
    href: '#',
  },
]

const SORT_OPTIONS: Array<{ value: DownloadSortKey; label: string }> = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'date-newest', label: 'Sort by Date (Newest)' },
  { value: 'date-oldest', label: 'Sort by Date (Oldest)' },
  { value: 'size', label: 'Sort by File Size' },
]

function formatPublishedDate(dateString?: string): string {
  if (!dateString) return 'Date unavailable'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function compareBySort(a: DownloadResourceItem, b: DownloadResourceItem, sortKey: DownloadSortKey): number {
  if (sortKey === 'name') {
    return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
  }

  if (sortKey === 'size') {
    return (b.sizeInMb ?? 0) - (a.sizeInMb ?? 0)
  }

  const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
  const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
  return sortKey === 'date-oldest' ? left - right : right - left
}

export function DownloadSectionBlockFE({
  title = 'Downloadable Resources',
  sortLabel = 'Sort resources',
  items = DEFAULT_ITEMS,
  className,
  sectionId,
}: DownloadSectionBlockProps) {
  const [sortKey, setSortKey] = React.useState<DownloadSortKey>('name')

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => compareBySort(a, b, sortKey))
  }, [items, sortKey])

  return (
    <section
      id={sectionId}
      className={clsx('download-section', className)}
      aria-label="Downloadable resources"
    >
      <div className="download-section__header">
        <h2 className="download-section__title type-heading-h3">{title}</h2>
        <div className="download-section__sort-wrap">
          <label className="sr-only" htmlFor="download-sort">
            {sortLabel}
          </label>
          <div className="download-section__sort-control">
            <select
              id="download-sort"
              className="download-section__sort-select type-body-base-regular"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as DownloadSortKey)}
              aria-label={sortLabel}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="download-section__sort-icon" aria-hidden>
              <GlobalIcon type="chevron-down" size="L" />
            </span>
          </div>
        </div>
      </div>

      <div className="download-section__list">
        {sortedItems.map((item, index) => (
          <article
            key={item.id}
            className={clsx(
              'download-section__item',
              index < sortedItems.length - 1 && 'download-section__item--bordered'
            )}
          >
            <div className="download-section__item-meta">
              <span className="download-section__badge type-body-small-medium">
                {item.extension ?? 'FILE'}
              </span>
              <div className="download-section__item-text">
                <p className="download-section__item-title type-body-base-medium">
                  {item.label}
                </p>
                <p className="download-section__item-subtext type-body-small-regular">
                  {item.sizeLabel ?? 'Unknown size'} · {formatPublishedDate(item.publishedAt)}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="download-section__download-btn"
              icon={<GlobalIcon type="download" size="S" />}
              iconPosition="right"
            >
              <a href={item.href} download>
                Download
              </a>
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}

type CmsDownloadSectionProps = Omit<
  DownloadSectionBlockFragmentFragment,
  '__typename'
>

export default function DownloadSectionBlock(props: CmsDownloadSectionProps) {
  const items: DownloadResourceItem[] = []
  props.Items?.forEach((it, index) => {
    if (!it || it.__typename !== 'DownloadResourceBlock') return
    const href = linkToAbsoluteUrl(
      it.Href as Parameters<typeof linkToAbsoluteUrl>[0]
    )
    if (!href) return
    const id = it.Id?.trim() || `dl-${index}`
    const label = it.Label?.trim() || 'Download'
    items.push({
      id,
      label,
      extension: it.Extension ?? undefined,
      sizeLabel: it.SizeLabel ?? undefined,
      sizeInMb: it.SizeInMb ?? undefined,
      publishedAt: it.PublishedAt
        ? String(it.PublishedAt).slice(0, 10)
        : undefined,
      href,
    })
  })

  return (
    <DownloadSectionBlockFE
      title={props.Title ?? undefined}
      sortLabel={props.SortLabel ?? undefined}
      items={items.length ? items : undefined}
    />
  )
}
