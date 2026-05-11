'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useState } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'
import { Pagination } from '@/components/ui/pagination'
import { TextLink } from '@/components/ui/text-link'

import styles from '@/styles/components/card-listing-block.module.scss'
import type { CardListingBlockFragmentFragment } from '@/lib/optimizely/types/generated'

const ALL_CHIP_ID = '__all__'

export type CardListingImageFit = 'cover' | 'contain'

export type CardListingItem = {
  id: string
  title: string
  /** Omit when the card has title-only body (e.g. debit PLP). */
  description?: string
  imageSrc: string
  imageFit?: CardListingImageFit
  /** Edge-to-edge image in the media slot (default keeps vertical inset like PLP cards). */
  imageFlush?: boolean
  badgeLabel?: string
  badgeVariant?: 'primary' | 'highlight'
  linkLabel?: string
  linkHref?: string
  /** Used when `chipFilters` is set; items without `chipId` only appear when “All” is selected. */
  chipId?: string
}

export type CardListingChipFilter = {
  id: string
  label: string
}

export type CardListingBlockProps = {
  title?: string
  subtitle?: string
  items: CardListingItem[]
  /** When omitted or empty, chip filters are hidden and every item is listed. */
  chipFilters?: CardListingChipFilter[]
  /** Prepended “show all” chip when `chipFilters` is used. */
  allChipLabel?: string
  pageSize?: number
  backgroundColor?: string
  paginationAriaLabel?: string
  showPaginationSummary?: boolean
  emptyLabel?: string
  /** Mobile / tablet: loads the next `pageSize` cards (desktop uses numeric pagination). */
  loadMoreLabel?: string
  /** Nested inside tabs / parents that already provide layout — avoids duplicate `<section>` semantics. */
  embedded?: boolean
}

export function CardListingBlockFE({
  title,
  subtitle,
  items,
  chipFilters,
  allChipLabel = 'All',
  pageSize = 12,
  backgroundColor = 'var(--neutral-050, #f7f7f7)',
  paginationAriaLabel = 'Results pagination',
  showPaginationSummary = true,
  emptyLabel = 'No items match your selection.',
  loadMoreLabel = 'Show more Cards',
  embedded = false,
}: CardListingBlockProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const headingId = title ? `card-listing-title-${id}` : undefined

  const hasChipRow = Boolean(chipFilters?.length)
  const chipTabs = useMemo(() => {
    if (!chipFilters?.length) return []
    return [{ id: ALL_CHIP_ID, label: allChipLabel }, ...chipFilters]
  }, [chipFilters, allChipLabel])

  const [activeChipId, setActiveChipId] = useState(ALL_CHIP_ID)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobilePagesShown, setMobilePagesShown] = useState(1)
  const [isDesktop, setIsDesktop] = useState(false)

  const chipFiltersKey =
    chipFilters?.map((c) => `${c.id}:${c.label}`).join('|') ?? ''

  useEffect(() => {
    setActiveChipId(ALL_CHIP_ID)
  }, [chipFiltersKey])

  useEffect(() => {
    setCurrentPage(1)
    setMobilePagesShown(1)
  }, [activeChipId])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const filteredItems = useMemo(() => {
    if (!hasChipRow || activeChipId === ALL_CHIP_ID) return items
    return items.filter((item) => item.chipId === activeChipId)
  }, [items, hasChipRow, activeChipId])

  const safePageSize = Math.max(1, Math.floor(pageSize))
  const totalFiltered = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / safePageSize))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const mobileVisibleCount = Math.min(mobilePagesShown * safePageSize, totalFiltered)

  const paginatedItems = useMemo(() => {
    if (isDesktop) {
      const start = (currentPage - 1) * safePageSize
      return filteredItems.slice(start, start + safePageSize)
    }
    return filteredItems.slice(0, mobileVisibleCount)
  }, [
    filteredItems,
    isDesktop,
    currentPage,
    safePageSize,
    mobileVisibleCount,
  ])

  const showDesktopPagination = isDesktop && totalFiltered > 0
  const showLoadMore =
    !isDesktop && totalFiltered > mobilePagesShown * safePageSize

  const outerClassName = embedded ? styles.embeddedRoot : styles.section
  const RootTag = embedded ? 'div' : 'section'

  return (
    <RootTag
      className={outerClassName}
      style={{ backgroundColor }}
      {...(!embedded && headingId ? { 'aria-labelledby': headingId } : {})}
    >
      <div className={`${styles.inner} container mx-auto`}>
        {(title || subtitle) && (
          <header className={styles.header}>
            {title ? (
              <h2 id={headingId} className={styles.title}>
                {title}
              </h2>
            ) : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>
        )}

        {hasChipRow ? (
          <div className={styles.chips} role="tablist" aria-label="Filter results">
            {chipTabs.map((chip) => {
              const active = chip.id === activeChipId
              return (
                <button
                  key={chip.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={clsx(styles.chip, active && styles.chipActive)}
                  onClick={() => setActiveChipId(chip.id)}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        ) : null}

        {totalFiltered === 0 ? (
          <p className={styles.empty}>{emptyLabel}</p>
        ) : (
          <ul className={styles.grid}>
            {paginatedItems.map((item) => {
              const fit = item.imageFit ?? 'cover'
              const imageFlush = item.imageFlush === true
              return (
                <li key={item.id} className={styles.gridItem}>
                  <article className={styles.card}>
                    <div className={styles.imageWrap}>
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 272px, (min-width: 768px) 45vw, 100vw"
                        className={clsx(
                          styles.cardImage,
                          imageFlush && styles.cardImageFlush,
                          fit === 'cover' ? styles.cardImageCover : styles.cardImageContain
                        )}
                        unoptimized
                        loader={({ src }) => src}
                      />
                      {item.badgeLabel ? (
                        <span
                          className={clsx(
                            styles.badge,
                            item.badgeVariant === 'highlight'
                              ? styles.badgeHighlight
                              : styles.badgePrimary
                          )}
                        >
                          {item.badgeLabel}
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.body}>
                      <div className={styles.textStack}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        {item.description ? (
                          <p className={styles.description}>{item.description}</p>
                        ) : null}
                      </div>
                      {item.linkLabel && item.linkHref ? (
                        <TextLink
                          href={item.linkHref}
                          size="S"
                          icon={<GlobalIcon type="arrow-right" size="S" />}
                          className={styles.ctaLink}
                        >
                          {item.linkLabel}
                        </TextLink>
                      ) : null}
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}

        {showDesktopPagination ? (
          <div className={styles.paginationWrap}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalFiltered}
              pageSize={safePageSize}
              onPageChange={setCurrentPage}
              ariaLabel={paginationAriaLabel}
              showSummary={showPaginationSummary}
            />
          </div>
        ) : null}

        {showLoadMore ? (
          <div className={styles.loadMoreWrap}>
            <Button
              type="button"
              hierarchy="secondary"
              size="lg"
              onClick={() => setMobilePagesShown((p) => p + 1)}
            >
              {loadMoreLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </RootTag>
  )
}

// --- CMS (Optimizely) → presentational props ---------------------------------

type CardListingBlockCmsProps = Omit<CardListingBlockFragmentFragment, '__typename'>

type CardListingItemRow = Extract<
  NonNullable<CardListingBlockFragmentFragment['items']>[number],
  { __typename: 'CardListingItemBlock' }
>

type CardListingChipRow = Extract<
  NonNullable<CardListingBlockFragmentFragment['chipFilters']>[number],
  { __typename: 'CardListingChipFilterBlock' }
>

function htmlToPlainText(html: string | null | undefined): string | undefined {
  if (!html?.trim()) return undefined
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text || undefined
}

function firstUrl(
  url:
    | {
        default?: string | null
        internal?: string | null
        hierarchical?: string | null
        base?: string | null
      }
    | null
    | undefined
): string {
  return (
    url?.default?.trim() ||
    url?.internal?.trim() ||
    url?.hierarchical?.trim() ||
    url?.base?.trim() ||
    ''
  )
}

function resolveImageSrc(item: CardListingItemRow): string {
  const ref = item.image
  if (!ref) return '/placeholder.svg'
  const fromRef = firstUrl(ref.url)
  if (fromRef) return fromRef
  const media = ref.item
  if (media?.__typename === 'ImageMedia' && media._assetMetadata?.url) {
    return media._assetMetadata.url
  }
  return '/placeholder.svg'
}

function parsePageSize(raw: string | null | undefined): number | undefined {
  if (raw == null || raw === '') return undefined
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

function mapBadgeVariant(
  v: string | null | undefined
): CardListingItem['badgeVariant'] {
  if (v === 'highlight' || v === 'primary') return v
  return undefined
}

function mapImageFit(v: string | null | undefined): CardListingImageFit | undefined {
  if (v === 'contain' || v === 'cover') return v
  return undefined
}

function metadataKey(
  meta: CardListingItemRow['_metadata'] | null | undefined
): string | undefined {
  return meta?.key ?? undefined
}

function mapCmsItems(items: CardListingBlockCmsProps['items']): CardListingItem[] {
  if (!items?.length) return []
  const out: CardListingItem[] = []
  for (const raw of items) {
    if (raw?.__typename !== 'CardListingItemBlock') continue
    const item = raw as CardListingItemRow
    const id = metadataKey(item._metadata) ?? item.title ?? `card-${out.length}`
    const link = item.cardListingLink
    const linkHref = firstUrl(link?.url) || undefined
    const linkLabel = item.linkLabel ?? link?.text ?? undefined

    out.push({
      id,
      title: item.title ?? '',
      description: htmlToPlainText(item.cardListingDescription?.html ?? undefined),
      imageSrc: resolveImageSrc(item),
      imageFit: mapImageFit(item.imageFit ?? undefined),
      imageFlush: item.imageFlush === true,
      badgeLabel: item.badgeLabel ?? undefined,
      badgeVariant: mapBadgeVariant(item.badgeVariant ?? undefined),
      linkLabel,
      linkHref,
      chipId: item.chipId ?? undefined,
    })
  }
  return out
}

function mapCmsChipFilters(
  chipFilters: CardListingBlockCmsProps['chipFilters']
): CardListingChipFilter[] | undefined {
  if (!chipFilters?.length) return undefined
  const out: CardListingChipFilter[] = []
  for (const row of chipFilters) {
    if (row?.__typename !== 'CardListingChipFilterBlock') continue
    const chip = row as CardListingChipRow
    const id = chip.id?.trim()
    const label = chip.label?.trim()
    if (id && label) out.push({ id, label })
  }
  return out.length ? out : undefined
}

/** Optimizely `CardListingBlock` from page queries → {@link CardListingBlockFE}. */
export default function CardListingBlock(props: CardListingBlockCmsProps) {
  const {
    title,
    subtitle,
    allChipLabel,
    pageSize,
    backgroundColor,
    paginationAriaLabel,
    showPaginationSummary,
    emptyLabel,
    loadMoreLabel,
    items,
    chipFilters,
  } = props

  return (
    <CardListingBlockFE
      title={title ?? undefined}
      subtitle={subtitle ?? undefined}
      items={mapCmsItems(items)}
      chipFilters={mapCmsChipFilters(chipFilters)}
      allChipLabel={allChipLabel ?? undefined}
      pageSize={parsePageSize(pageSize)}
      backgroundColor={backgroundColor ?? undefined}
      paginationAriaLabel={paginationAriaLabel ?? undefined}
      showPaginationSummary={showPaginationSummary ?? undefined}
      emptyLabel={emptyLabel ?? undefined}
      loadMoreLabel={loadMoreLabel ?? undefined}
      embedded={false}
    />
  )
}
