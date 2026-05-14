'use client'

import * as React from 'react'
import clsx from 'clsx'

import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'

import type { DownloadSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import {
  assetFromDownloadMedia,
  displaySizeFromBytes,
  linkToAbsoluteUrl,
  mimeTypeToFileExtension,
} from './map-cms'

type DownloadSortKey = 'name' | 'date-newest' | 'date-oldest' | 'size'

export type DownloadResourceItem = {
  id: string
  label: string
  extension?: string
  /** From media `mimeType` when present (for display). */
  mimeType?: string
  sizeLabel?: string
  sizeInMb?: number
  publishedAt?: string
  /** Omitted when no URL is available from CMS. */
  href?: string
}

export type DownloadSectionBlockProps = {
  title?: string
  sortLabel?: string
  items?: DownloadResourceItem[]
  className?: string
  sectionId?: string
}

const SORT_OPTIONS: Array<{ value: DownloadSortKey; label: string }> = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'date-newest', label: 'Sort by Date (Newest)' },
  { value: 'date-oldest', label: 'Sort by Date (Oldest)' },
  { value: 'size', label: 'Sort by File Size' },
]

function formatPublishedDate(dateString?: string): string {
  if (!dateString?.trim()) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
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
  title,
  sortLabel,
  items = [],
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
        <h2 className="download-section__title type-heading-h3">{title ?? ''}</h2>
        <div className="download-section__sort-wrap">
          <label className="sr-only" htmlFor="download-sort">
            {sortLabel ?? ''}
          </label>
          <div className="download-section__sort-control">
            <select
              id="download-sort"
              className="download-section__sort-select type-body-base-regular"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as DownloadSortKey)}
              aria-label={sortLabel ?? ''}
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
              {item.extension ? (
                <span className="download-section__badge type-body-small-medium">
                  {item.extension}
                </span>
              ) : null}
              <div className="download-section__item-text">
                <p className="download-section__item-title type-body-base-medium">
                  {item.label}
                </p>
                <p className="download-section__item-subtext type-body-small-regular">
                  {[item.sizeLabel, formatPublishedDate(item.publishedAt), item.mimeType]
                    .filter((s) => s && String(s).trim())
                    .join(' · ')}
                </p>
              </div>
            </div>
            {item.href ? (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="download-section__download-btn"
                icon={<GlobalIcon type="download" size="S" />}
                iconPosition="right"
              >
                <a
                  href={item.href}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="download-section__download-btn"
                disabled
                icon={<GlobalIcon type="download" size="S" />}
                iconPosition="right"
              >
                Download
              </Button>
            )}
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

function sortLabelFromOptionBlocks(
  list: CmsDownloadSectionProps['sortLabelList'] | null | undefined
): string | undefined {
  const text =
    list
      ?.map((item) => {
        if (item?.__typename === 'OptionBlock') {
          return item.OptionText?.trim() ?? ''
        }
        return ''
      })
      .find((s) => s.length > 0) ?? ''
  return text || undefined
}

export default function DownloadSectionBlock(props: CmsDownloadSectionProps) {
  const items: DownloadResourceItem[] = []
  props.Items?.forEach((it, index) => {
    if (!it || it.__typename !== 'DownloadResourceBlock') return
    const asset = assetFromDownloadMedia(it.DownloadMedia)
    const linkHref = linkToAbsoluteUrl(
      it.Href as Parameters<typeof linkToAbsoluteUrl>[0]
    )
    const href = linkHref || asset?.url || undefined

    const blockExt = it.Extension?.trim()
    const extension =
      blockExt || mimeTypeToFileExtension(asset?.mimeType) || undefined

    const fromBytes =
      asset?.fileSize != null && asset.fileSize > 0
        ? displaySizeFromBytes(asset.fileSize)
        : undefined
    const blockSizeLabel = it.SizeLabel?.trim()
    const sizeLabel = blockSizeLabel || fromBytes?.sizeLabel
    const sizeInMb =
      it.SizeInMb != null && Number.isFinite(it.SizeInMb) && it.SizeInMb > 0
        ? it.SizeInMb
        : fromBytes?.sizeInMb

    const blockPublished = it.PublishedAt
      ? String(it.PublishedAt).slice(0, 10)
      : undefined
    const publishedAt =
      blockPublished ||
      asset?.lastModifiedDay ||
      asset?.contentModifiedDay

    items.push({
      id: it.Id?.trim() ?? String(index),
      label: it.Label?.trim() ?? '',
      extension,
      mimeType: asset?.mimeType,
      sizeLabel,
      sizeInMb,
      publishedAt,
      href,
    })
  })

  return (
    <DownloadSectionBlockFE
      title={props.Title ?? undefined}
      sortLabel={sortLabelFromOptionBlocks(props.sortLabelList)}
      items={items}
    />
  )
}
