'use client'

import Link from 'next/link'
import { useId } from 'react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { HeroBannerBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/hero-banner-block.module.scss'

export type HeroBannerBlockProps = {
  /** Optimizely on-page editing: parent block content key (`_metadata.key`). */
  blockEpiId?: string
  badgeLabel?: string
  title?: string
  subtitle?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  activeDotIndex?: number
  /**
   * Background image sources.
   * If `mobileImageSrc` is not provided, desktop image will be used for mobile too.
   */
  desktopImageSrc?: string
  mobileImageSrc?: string
  items?: HeroBannerItem[]
}

export type HeroBannerItem = {
  /** Per-slide content key for nested OPE (`HeroBannerItem._metadata.key`). */
  epiBlockId?: string
  badgeLabel?: string
  title: string
  subtitle?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  desktopImageSrc?: string
  mobileImageSrc?: string
}

/** Presentational hero (preview / Storybook). CMS pages use the default export mapper. */
export function HeroBannerBlockFE({
  blockEpiId,
  badgeLabel = 'Personal Loan',
  title = '',
  subtitle,
  primaryCtaLabel = 'Request information',
  primaryCtaHref = '#',
  secondaryCtaLabel = 'Download brochure',
  secondaryCtaHref = '#',
  activeDotIndex = 0,
  desktopImageSrc = '/assets/images/Hero-banner.png',
  mobileImageSrc,
  items,
}: HeroBannerBlockProps) {
  const fallbackItem: HeroBannerItem = {
    epiBlockId: undefined,
    badgeLabel,
    title,
    subtitle,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    desktopImageSrc,
    mobileImageSrc,
  }
  const slides = items?.length ? items : [fallbackItem]
  const hasMultipleItems = slides.length > 1
  const safeActiveIndex = Math.max(0, Math.min(activeDotIndex, slides.length - 1))
  const paginationClass = `heroBannerPagination-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  const renderSlide = (item: HeroBannerItem) => {
    const resolvedDesktopSrc = item.desktopImageSrc ?? '/assets/images/Hero-banner.png'
    const resolvedMobileSrc = item.mobileImageSrc ?? resolvedDesktopSrc

    return (
      <article
        className={styles.slideContent}
        {...(item.epiBlockId ? { 'data-epi-block-id': item.epiBlockId } : {})}
      >
        <picture className={styles.picture}>
          <source
            media="(max-width: 767px)"
            srcSet={resolvedMobileSrc}
            data-epi-edit="mobileImageSrc"
          />
          <img
            src={resolvedDesktopSrc}
            alt=""
            aria-hidden="true"
            className={styles.image}
            loading="lazy"
            decoding="async"
            data-epi-edit="desktopImageSrc"
          />
        </picture>

        <div className={styles.content}>
          <div className={cn(styles.contentInner, 'container mx-auto px-4')}>
            <div className={styles.textBlock}>
              <span
                className={cn('type-label-small-regular', styles.badge)}
                data-epi-edit="badgeLabel"
              >
                {item.badgeLabel ?? 'Personal Loan'}
              </span>

              <h1
                className={cn('type-heading-display', styles.title)}
                data-epi-edit="title"
              >
                {item.title}
              </h1>

              {item.subtitle ? (
                <p
                  className={cn('type-body-large-regular', styles.subtitle)}
                  data-epi-edit="subtitle"
                >
                  {item.subtitle}
                </p>
              ) : null}
            </div>

            <div className={styles.ctaRow}>
              <Button
                asChild
                hierarchy="primary"
                size="lg"
                className={styles.ctaButton}
              >
                <Link
                  href={item.primaryCtaHref ?? '#'}
                  aria-label={item.primaryCtaLabel ?? 'Request information'}
                  data-epi-edit="primaryCtaHref"
                >
                  <span data-epi-edit="primaryCtaLabel">
                    {item.primaryCtaLabel ?? 'Request information'}
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                hierarchy="secondary"
                size="lg"
                className={styles.ctaButton}
              >
                <Link
                  href={item.secondaryCtaHref ?? '#'}
                  aria-label={item.secondaryCtaLabel ?? 'Download brochure'}
                  data-epi-edit="secondaryCtaHref"
                >
                  <span data-epi-edit="secondaryCtaLabel">
                    {item.secondaryCtaLabel ?? 'Download brochure'}
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <section
      className={styles.heroBanner}
      aria-label="Hero banner"
      {...(blockEpiId ? { 'data-epi-block-id': blockEpiId } : {})}
    >
      {hasMultipleItems ? (
        <>
          <Swiper
            className={styles.slider}
            modules={[Pagination]}
            initialSlide={safeActiveIndex}
            slidesPerView={1}
            pagination={{
              el: `.${paginationClass}`,
              clickable: true,
              bulletClass: styles.dot,
              bulletActiveClass: styles.dotActive,
            }}
          >
            {slides.map((item, index) => (
              <SwiperSlide key={`${item.title}-${index}`} className={styles.slide} >
                {renderSlide(item)}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={cn(styles.dots, paginationClass)} aria-hidden="true" />
        </>
      ) : (
        renderSlide(slides[0])
      )}
    </section>
  )
}

// --- CMS (Optimizely) → presentational --------------------------------------

type HeroBannerBlockCmsProps = Omit<HeroBannerBlockFragmentFragment, '__typename'>

type HeroBannerItemRow = Extract<
  NonNullable<NonNullable<HeroBannerBlockFragmentFragment['items']>[number]>,
  { __typename: 'HeroBannerItem' }
>

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

function hrefFromLink(
  link: HeroBannerItemRow['primaryCtaHref'] | HeroBannerItemRow['secondaryCtaHref']
): string | undefined {
  const href = firstUrl(link?.url ?? undefined)
  return href || undefined
}

function labelFromLink(
  link: HeroBannerItemRow['primaryCtaHref'] | HeroBannerItemRow['secondaryCtaHref'],
  explicitLabel: string | null | undefined
): string | undefined {
  return explicitLabel?.trim() || link?.text?.trim() || undefined
}

function imageSrcFromIContent(
  ref: HeroBannerItemRow['desktopImageSrc'] | HeroBannerItemRow['mobileImageSrc']
): string | undefined {
  if (!ref) return undefined
  if (ref.__typename === 'ImageMedia' || ref.__typename === 'GenericMedia') {
    const u = ref._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

function mapCmsItems(
  items: HeroBannerBlockCmsProps['items'] | undefined
): HeroBannerItem[] | undefined {
  if (!items?.length) return undefined
  const out: HeroBannerItem[] = []
  for (const raw of items) {
    if (raw?.__typename !== 'HeroBannerItem') continue
    const row = raw
    const title = row.title?.trim()
    if (!title) continue
    out.push({
      epiBlockId: row._metadata?.key?.trim() || undefined,
      badgeLabel: row.badgeLabel ?? undefined,
      title,
      subtitle: row.subtitle ?? undefined,
      primaryCtaLabel: labelFromLink(row.primaryCtaHref, row.primaryCtaLabel),
      primaryCtaHref: hrefFromLink(row.primaryCtaHref),
      secondaryCtaLabel: labelFromLink(row.secondaryCtaHref, row.secondaryCtaLabel),
      secondaryCtaHref: hrefFromLink(row.secondaryCtaHref),
      desktopImageSrc: imageSrcFromIContent(row.desktopImageSrc),
      mobileImageSrc: imageSrcFromIContent(row.mobileImageSrc),
    })
  }
  return out.length ? out : undefined
}

function parseActiveDotIndex(raw: number | null | undefined): number | undefined {
  if (raw == null) return undefined
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return Math.floor(raw)
  return undefined
}

/** Optimizely `HeroBannerBlock` from page queries → {@link HeroBannerBlockFE}. */
export default function HeroBannerBlock(props: HeroBannerBlockCmsProps) {
  const slides = mapCmsItems(props.items)
  const dot = parseActiveDotIndex(props.activeDotIndex ?? undefined)
  const blockEpiId = props._metadata?.key?.trim() || undefined

  return (
    <HeroBannerBlockFE
      blockEpiId={blockEpiId}
      activeDotIndex={dot ?? 0}
      items={slides}
    />
  )
}
